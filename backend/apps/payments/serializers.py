from rest_framework import serializers
from .models import PaymentMethod, Payment


class PaymentMethodSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True, default='')

    class Meta:
        model = PaymentMethod
        fields = ['id', 'label', 'method_type', 'masked_identifier', 'owner', 'owner_name', 'department', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class PaymentSerializer(serializers.ModelSerializer):
    method_label = serializers.CharField(source='method.label', read_only=True)
    booking_reference = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = [
            'id', 'booking', 'booking_reference', 'method', 'method_label', 'amount',
            'status', 'transaction_ref', 'processed_by', 'paid_at', 'created_at',
        ]
        read_only_fields = ['id', 'processed_by', 'paid_at', 'created_at']

    def get_booking_reference(self, obj):
        return f'TRV-{obj.booking_id:05d}'
