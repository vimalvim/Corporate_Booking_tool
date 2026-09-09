from rest_framework import serializers
from .models import Booking, BookingItem


class BookingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingItem
        fields = ['id', 'item_type', 'provider', 'class_or_category', 'details', 'cost', 'quantity']
        read_only_fields = ['id']


class BookingSerializer(serializers.ModelSerializer):
    items = BookingItemSerializer(many=True)
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    employee_code = serializers.CharField(source='employee.employee_code', read_only=True)
    department = serializers.CharField(source='employee.department', read_only=True)
    reference = serializers.SerializerMethodField()
    approvals = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'reference', 'employee', 'employee_name', 'employee_code', 'department',
            'trip_type', 'purpose', 'origin', 'destination', 'start_date', 'end_date',
            'status', 'estimated_cost', 'is_policy_violation', 'policy_violation_details',
            'deviation_justification', 'items', 'approvals', 'created_at', 'updated_at',
            'submitted_at', 'decided_at',
        ]
        read_only_fields = [
            'id', 'employee', 'status', 'is_policy_violation', 'policy_violation_details',
            'created_at', 'updated_at', 'submitted_at', 'decided_at',
        ]

    def get_approvals(self, obj):
        # Local import avoids a module-level circular import between the
        # bookings and approvals apps (approvals.models references
        # bookings.Booking via a lazy 'bookings.Booking' string FK already).
        from apps.approvals.serializers import ApprovalSerializer
        return ApprovalSerializer(obj.approvals.all().order_by('level'), many=True).data

    def get_reference(self, obj):
        return f'TRV-{obj.id:05d}' if obj.id else None

    def validate(self, attrs):
        if attrs.get('end_date') and attrs.get('start_date') and attrs['end_date'] < attrs['start_date']:
            raise serializers.ValidationError({'end_date': 'End date cannot be before start date.'})
        return attrs

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        booking = Booking.objects.create(employee=self.context['request'].user, **validated_data)
        self._sync_items(booking, items_data)
        booking.estimated_cost = sum(i.cost * i.quantity for i in booking.items.all())
        booking.save(update_fields=['estimated_cost'])
        return booking

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if items_data is not None:
            instance.items.all().delete()
            self._sync_items(instance, items_data)
        instance.estimated_cost = sum(i.cost * i.quantity for i in instance.items.all())
        instance.save()
        return instance

    @staticmethod
    def _sync_items(booking, items_data):
        BookingItem.objects.bulk_create([
            BookingItem(booking=booking, **item) for item in items_data
        ])


class SubmitBookingSerializer(serializers.Serializer):
    deviation_justification = serializers.CharField(required=False, allow_blank=True, default='')
