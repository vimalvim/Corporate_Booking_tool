from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from core.permissions import IsAdminOrFinanceOrReadOnly
from .models import DepartmentBudget
from .serializers import DepartmentBudgetSerializer


class DepartmentBudgetViewSet(viewsets.ModelViewSet):
    """Budget Management module: Admin/Finance configure allocations, all
    authenticated roles can read (so employees see remaining budget)."""
    queryset = DepartmentBudget.objects.all()
    serializer_class = DepartmentBudgetSerializer
    permission_classes = [IsAuthenticated, IsAdminOrFinanceOrReadOnly]
    filterset_fields = ['department', 'fiscal_year']
