"""
Central RBAC permission classes.

Every module in the system reuses these instead of re-implementing role
checks, so there is exactly one place that defines "who is allowed to do
what". Roles come from apps.accounts.models.User.Role.
"""
from rest_framework.permissions import BasePermission, SAFE_METHODS


class HasRole(BasePermission):
    """Base class: subclass and set `allowed_roles`."""
    allowed_roles: tuple[str, ...] = ()

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (user.is_superuser or user.role in self.allowed_roles)
        )


class IsAdmin(HasRole):
    allowed_roles = ('ADMIN',)


class IsFinance(HasRole):
    allowed_roles = ('ADMIN', 'FINANCE')


class IsApprover(HasRole):
    allowed_roles = ('ADMIN', 'MANAGER', 'FINANCE')


class IsAdminOrFinanceOrReadOnly(BasePermission):
    """Anyone authenticated can read; only Admin/Finance can write."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_superuser or request.user.role in ('ADMIN', 'FINANCE')


class IsOwnerOrApproverOrAdmin(BasePermission):
    """
    Object-level check used on Booking: the employee who owns the booking,
    any of their approval chain, Finance, or Admin may view/act on it.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_superuser or user.role in ('ADMIN', 'FINANCE'):
            return True
        if obj.employee_id == user.id:
            return True
        if user.role == 'MANAGER' and obj.employee.manager_id == user.id:
            return True
        return False
