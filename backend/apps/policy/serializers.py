from rest_framework import serializers
from .models import TravelPolicy


class TravelPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelPolicy
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
