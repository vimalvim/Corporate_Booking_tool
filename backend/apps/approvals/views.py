from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import IsAdmin, IsApprover
from .models import ApprovalMatrixRule, Approval
from .serializers import ApprovalMatrixRuleSerializer, ApprovalSerializer, ApprovalActionSerializer
from .services import act_on_approval


class ApprovalMatrixRuleViewSet(viewsets.ModelViewSet):
    """Approval Matrix module: Admin configures the approver chain per
    amount band."""
    queryset = ApprovalMatrixRule.objects.all()
    serializer_class = ApprovalMatrixRuleSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class ApprovalViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """
    Read-only list of approval steps, scoped to what the current user is
    allowed to act on, plus a `decide` action to approve/reject.
    - Manager sees PENDING steps for their direct reports' bookings.
    - Finance/Admin see PENDING Finance/Admin steps.
    - Everyone can see the history of approvals on their own bookings via
      the nested `booking.approvals` (see bookings serializer) instead.
    """
    serializer_class = ApprovalSerializer
    permission_classes = [IsAuthenticated, IsApprover]
    filterset_fields = ['status', 'approver_role', 'level']

    def get_queryset(self):
        user = self.request.user
        qs = Approval.objects.select_related('booking', 'booking__employee', 'approver')
        if user.is_superuser or user.role == 'ADMIN':
            return qs
        if user.role == 'FINANCE':
            return qs.filter(approver_role='FINANCE')
        # MANAGER: only steps for bookings made by their direct reports
        return qs.filter(approver_role='MANAGER', booking__employee__manager=user)

    @action(detail=True, methods=['post'])
    def decide(self, request, pk=None):
        approval = self.get_object()
        if approval.status != Approval.Status.PENDING:
            return Response({'detail': 'This approval step was already actioned.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ApprovalActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_status = act_on_approval(
            approval,
            actor=request.user,
            decision=serializer.validated_data['decision'],
            comments=serializer.validated_data.get('comments', ''),
        )
        return Response({
            'detail': f'Approval {serializer.validated_data["decision"].lower()}.',
            'booking_status': new_status,
        })
