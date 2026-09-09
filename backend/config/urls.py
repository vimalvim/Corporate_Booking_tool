from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/employees/', include('apps.employees.urls')),
    path('api/policy/', include('apps.policy.urls')),
    path('api/budget/', include('apps.budget.urls')),
    path('api/bookings/', include('apps.bookings.urls')),
    path('api/approvals/', include('apps.approvals.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/reports/', include('apps.reports.urls')),
]
