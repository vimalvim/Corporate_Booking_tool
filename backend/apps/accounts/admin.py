from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ['employee_code', 'username', 'role', 'department', 'manager', 'is_active_employee']
    list_filter = ['role', 'department', 'is_active_employee']
    fieldsets = DjangoUserAdmin.fieldsets + (
        ('Corporate travel profile', {
            'fields': ('role', 'employee_code', 'department', 'manager', 'is_active_employee')
        }),
    )
