from django.conf import settings
from django.db import models


class EmployeeProfile(models.Model):
    """
    Extended profile data beyond the core User/auth record — travel
    documents, grade (used by Travel Policy to decide entitlement), and
    contact details. One-to-one with the auth user created in `accounts`.
    """

    class Grade(models.TextChoices):
        L1_JUNIOR = 'L1', 'L1 - Junior'
        L2_MID = 'L2', 'L2 - Mid'
        L3_SENIOR = 'L3', 'L3 - Senior'
        L4_LEADERSHIP = 'L4', 'L4 - Leadership'
        L5_EXECUTIVE = 'L5', 'L5 - Executive'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    designation = models.CharField(max_length=100, blank=True)
    grade = models.CharField(max_length=2, choices=Grade.choices, default=Grade.L2_MID)
    cost_center = models.CharField(max_length=50, blank=True)
    base_city = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    passport_number = models.CharField(max_length=30, blank=True)
    frequent_flyer_no = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Profile: {self.user.employee_code}'
