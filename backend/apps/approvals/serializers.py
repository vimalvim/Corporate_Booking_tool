from rest_framework import serializers
from .models import ApprovalMatrixRule, Approval


class ApprovalMatrixRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovalMatrixRule
        fields = '__all__'
        read_only_fields = ['id']


class ApprovalSerializer(serializers.ModelSerializer):
    approver_name = serializers.CharField(source='approver.get_full_name', read_only=True, default='')
    booking_reference = serializers.SerializerMethodField()
    employee_name = serializers.CharField(source='booking.employee.get_full_name', read_only=True)
    estimated_cost = serializers.DecimalField(source='booking.estimated_cost', max_digits=12, decimal_places=2, read_only=True)
    is_policy_violation = serializers.BooleanField(source='booking.is_policy_violation', read_only=True)

    class Meta:
        model = Approval
        fields = [
            'id', 'booking', 'booking_reference', 'employee_name', 'estimated_cost',
            'is_policy_violation', 'level', 'approver_role', 'approver', 'approver_name',
            'status', 'comments', 'acted_at', 'created_at',
        ]
        read_only_fields = ['id', 'approver', 'acted_at', 'created_at']

    def get_booking_reference(self, obj):
        return f'TRV-{obj.booking_id:05d}'


class ApprovalActionSerializer(serializers.Serializer):
    decision = serializers.ChoiceField(choices=['APPROVED', 'REJECTED'])
    comments = serializers.CharField(required=False, allow_blank=True, default='')
