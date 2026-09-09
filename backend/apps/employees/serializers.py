from rest_framework import serializers
from .models import EmployeeProfile


class EmployeeProfileSerializer(serializers.ModelSerializer):
    employee_code = serializers.CharField(source='user.employee_code', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    department = serializers.CharField(source='user.department', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)

    class Meta:
        model = EmployeeProfile
        fields = [
            'id', 'user', 'employee_code', 'full_name', 'department', 'role',
            'designation', 'grade', 'cost_center', 'base_city', 'phone',
            'passport_number', 'frequent_flyer_no', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
