from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from core.permissions import IsAdmin
from .models import EmployeeProfile
from .serializers import EmployeeProfileSerializer


class EmployeeProfileViewSet(viewsets.ModelViewSet):
    """
    Employee Mapping & Profile Management module.
    Admin can manage every profile; an employee can view/update their own.
    """
    queryset = EmployeeProfile.objects.select_related('user', 'user__manager').all()
    serializer_class = EmployeeProfileSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['grade', 'user__department']

    def get_permissions(self):
        if self.action in ('list', 'create', 'destroy'):
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_superuser or user.role == 'ADMIN':
            return qs
        return qs.filter(user=user)
