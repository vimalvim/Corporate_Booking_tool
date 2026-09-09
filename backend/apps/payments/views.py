from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from core.permissions import IsFinance, IsAdminOrFinanceOrReadOnly
from .models import PaymentMethod, Payment
from .serializers import PaymentMethodSerializer, PaymentSerializer


class PaymentMethodViewSet(viewsets.ModelViewSet):
    """Payment Methods module: Finance/Admin configure; everyone can read
    the methods available to them when settling a booking."""
    queryset = PaymentMethod.objects.select_related('owner').all()
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated, IsAdminOrFinanceOrReadOnly]
    filterset_fields = ['method_type', 'is_active', 'department']


class PaymentViewSet(viewsets.ModelViewSet):
    """Payments module: only Finance/Admin can record/settle a payment
    against an APPROVED booking."""
    queryset = Payment.objects.select_related('booking', 'method').all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated, IsFinance]
    filterset_fields = ['status', 'method']

    def perform_create(self, serializer):
        serializer.save(processed_by=self.request.user, paid_at=timezone.now(), status=Payment.Status.PAID)
        booking = serializer.instance.booking
        booking.status = booking.Status.BOOKED
        booking.save(update_fields=['status'])
