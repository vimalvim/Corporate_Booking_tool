from django.conf import settings
from django.db import models


class ApprovalMatrixRule(models.Model):
    """
    Approval Matrix module (admin-configured). Defines, per trip-amount
    band, which sequence of approver roles must sign off. `level` orders
    the chain (1 = first approver). `applies_to_violation_only` lets Admin
    add an extra Finance level that only fires for out-of-policy bookings.
    """
    class ApproverRole(models.TextChoices):
        MANAGER = 'MANAGER', 'Reporting Manager'
        FINANCE = 'FINANCE', 'Finance'
        ADMIN = 'ADMIN', 'Admin'

    level = models.PositiveSmallIntegerField()
    min_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    max_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text='Blank = no upper bound')
    approver_role = models.CharField(max_length=20, choices=ApproverRole.choices)
    applies_to_violation_only = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['level', 'min_amount']

    def __str__(self):
        band = f'{self.min_amount}-{self.max_amount or "∞"}'
        return f'L{self.level} {self.approver_role} ({band})'


class Approval(models.Model):
    """One approval step instance on a specific booking, generated from the
    ApprovalMatrixRule chain when the booking is submitted."""

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        SKIPPED = 'SKIPPED', 'Skipped'

    booking = models.ForeignKey('bookings.Booking', on_delete=models.CASCADE, related_name='approvals')
    level = models.PositiveSmallIntegerField()
    approver_role = models.CharField(max_length=20)
    approver = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='approval_actions'
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    comments = models.TextField(blank=True)
    acted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['booking', 'level']
        unique_together = ('booking', 'level')

    def __str__(self):
        return f'Booking #{self.booking_id} L{self.level} {self.approver_role} - {self.status}'
