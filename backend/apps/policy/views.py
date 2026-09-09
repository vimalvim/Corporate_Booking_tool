from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from core.permissions import IsAdminOrFinanceOrReadOnly
from .models import TravelPolicy
from .serializers import TravelPolicySerializer


class TravelPolicyViewSet(viewsets.ModelViewSet):
    """Travel Policy Configuration module: Admin/Finance write, everyone reads
    (employees need to see their entitlement while booking)."""
    queryset = TravelPolicy.objects.all()
    serializer_class = TravelPolicySerializer
    permission_classes = [IsAuthenticated, IsAdminOrFinanceOrReadOnly]
    filterset_fields = ['grade', 'trip_type', 'is_active']
