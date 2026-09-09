from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import IsOwnerOrApproverOrAdmin
from .models import Booking
from .serializers import BookingSerializer, SubmitBookingSerializer
from .services import check_policy_violation, apply_budget_delta


class BookingViewSet(viewsets.ModelViewSet):
    """
    Travel Booking module. An employee creates/edits a DRAFT booking (with
    nested flight/hotel/train/cab items), then calls `submit`, which runs
    the policy check and hands the booking to the Approval Matrix chain.
    """
    queryset = Booking.objects.select_related('employee', 'employee__manager').prefetch_related('items', 'approvals')
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'trip_type', 'is_policy_violation']

    def get_permissions(self):
        if self.action in ('retrieve', 'submit', 'cancel'):
            return [IsAuthenticated(), IsOwnerOrApproverOrAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_superuser or user.role in ('ADMIN', 'FINANCE'):
            return qs
        if user.role == 'MANAGER':
            from django.db.models import Q
            return qs.filter(Q(employee=user) | Q(employee__manager=user))
        return qs.filter(employee=user)

    def perform_update(self, serializer):
        booking = self.get_object()
        if booking.status != Booking.Status.DRAFT:
            raise ValidationError({'detail': 'Only DRAFT bookings can be edited.'})
        serializer.save()

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        booking = self.get_object()
        if booking.status != Booking.Status.DRAFT:
            return Response({'detail': 'Only DRAFT bookings can be submitted.'}, status=status.HTTP_400_BAD_REQUEST)
        if not booking.items.exists():
            return Response({'detail': 'Add at least one travel item before submitting.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = SubmitBookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        is_violation, details = check_policy_violation(booking)
        if is_violation and not serializer.validated_data.get('deviation_justification'):
            return Response(
                {
                    'detail': 'This booking is out of policy. A justification is required to proceed.',
                    'policy_violation_details': details,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.is_policy_violation = is_violation
        booking.policy_violation_details = details
        booking.deviation_justification = serializer.validated_data.get('deviation_justification', '')
        booking.status = Booking.Status.PENDING_APPROVAL
        booking.submitted_at = timezone.now()
        booking.save()

        from apps.approvals.services import build_approval_chain
        build_approval_chain(booking)

        return Response(BookingSerializer(booking, context={'request': request}).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status in (Booking.Status.CANCELLED, Booking.Status.REJECTED):
            return Response({'detail': 'Booking is already closed.'}, status=status.HTTP_400_BAD_REQUEST)

        was_approved = booking.status in (Booking.Status.APPROVED, Booking.Status.BOOKED)
        booking.status = Booking.Status.CANCELLED
        booking.decided_at = timezone.now()
        booking.save(update_fields=['status', 'decided_at'])

        if was_approved:
            apply_budget_delta(booking, sign=-1)

        return Response(BookingSerializer(booking, context={'request': request}).data)
