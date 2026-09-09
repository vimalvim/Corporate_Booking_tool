from django.db import models


class DepartmentBudget(models.Model):
    """
    Budget Management module. One row per department per fiscal year.
    `used_amount` is incremented when a booking is APPROVED and decremented
    on CANCELLED — see apps.bookings.services.apply_budget_delta.
    """
    department = models.CharField(max_length=100)
    fiscal_year = models.CharField(max_length=9, help_text='e.g. 2026-2027')
    allocated_amount = models.DecimalField(max_digits=14, decimal_places=2)
    used_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('department', 'fiscal_year')
        ordering = ['department']

    @property
    def remaining_amount(self):
        return self.allocated_amount - self.used_amount

    @property
    def utilization_percent(self):
        if not self.allocated_amount:
            return 0
        return round(float(self.used_amount) / float(self.allocated_amount) * 100, 1)

    def __str__(self):
        return f'{self.department} ({self.fiscal_year})'
