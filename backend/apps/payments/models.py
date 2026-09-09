from django.conf import settings
from django.db import models


class PaymentMethod(models.Model):
    """Payment Methods module. A corporate card, cash-advance account, or
    direct-billing arrangement that can be attached to a Payment. Kept
    generic (masked details only, e.g. last 4 digits) — no real card data
    is ever stored, matching PCI-DSS scoping guidance for a demo system."""

    class MethodType(models.TextChoices):
        CORPORATE_CARD = 'CORPORATE_CARD', 'Corporate Card'
        CASH_ADVANCE = 'CASH_ADVANCE', 'Cash Advance'
        DIRECT_BILLING = 'DIRECT_BILLING', 'Direct Billing (Travel Desk)'

    label = models.CharField(max_length=100)
    method_type = models.CharField(max_length=20, choices=MethodType.choices)
    masked_identifier = models.CharField(max_length=50, blank=True, help_text='e.g. **** 4821')
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='payment_methods',
        help_text='Blank = shared/department-level method',
    )
    department = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.label} ({self.get_method_type_display()})'


class Payment(models.Model):
    """A settlement against an approved Booking."""

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PAID = 'PAID', 'Paid'
        FAILED = 'FAILED', 'Failed'
        REFUNDED = 'REFUNDED', 'Refunded'

    booking = models.OneToOneField('bookings.Booking', on_delete=models.CASCADE, related_name='payment')
    method = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    transaction_ref = models.CharField(max_length=100, blank=True)
    processed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='processed_payments'
    )
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Payment for booking #{self.booking_id} - {self.status}'
