from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model. `role` drives RBAC across the whole API (see
    core/permissions.py). `manager` is used by the Approval Matrix to find
    an employee's level-1 approver.
    """

    class Role(models.TextChoices):
        EMPLOYEE = 'EMPLOYEE', 'Employee'
        MANAGER = 'MANAGER', 'Manager / Approver'
        FINANCE = 'FINANCE', 'Finance'
        ADMIN = 'ADMIN', 'Admin'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.EMPLOYEE)
    employee_code = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100, blank=True)
    manager = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.SET_NULL, related_name='direct_reports'
    )
    is_active_employee = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.employee_code} - {self.get_full_name() or self.username}'
