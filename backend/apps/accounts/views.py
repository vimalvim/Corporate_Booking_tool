from rest_framework import status, viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend

from core.permissions import IsAdmin
from .models import User
from .serializers import (
    RoleAwareTokenObtainPairSerializer,
    UserSerializer,
    UserCreateSerializer,
    ChangePasswordSerializer,
)


class LoginView(TokenObtainPairView):
    """POST {username, password} -> {access, refresh, user}."""
    serializer_class = RoleAwareTokenObtainPairSerializer


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({'detail': 'Old password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'detail': 'Password updated.'})


class UserViewSet(viewsets.ModelViewSet):
    """
    Admin-only user directory management (create employees/managers/finance
    users, assign roles and reporting manager). Used by Employee Mapping &
    Profile Management module.
    """
    queryset = User.objects.select_related('manager').all().order_by('employee_code')
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['role', 'department', 'is_active_employee']
    search_fields = ['username', 'first_name', 'last_name', 'employee_code']

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
