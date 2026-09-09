from rest_framework import serializers
from .models import DepartmentBudget


class DepartmentBudgetSerializer(serializers.ModelSerializer):
    remaining_amount = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    utilization_percent = serializers.FloatField(read_only=True)

    class Meta:
        model = DepartmentBudget
        fields = [
            'id', 'department', 'fiscal_year', 'allocated_amount', 'used_amount',
            'remaining_amount', 'utilization_percent', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'used_amount', 'created_at', 'updated_at']
