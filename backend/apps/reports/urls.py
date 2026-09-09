from django.urls import path
from .views import SpendByDepartmentView, BookingFunnelView, PolicyViolationReportView, ApprovalTurnaroundView

urlpatterns = [
    path('spend-by-department/', SpendByDepartmentView.as_view(), name='report-spend-by-department'),
    path('booking-funnel/', BookingFunnelView.as_view(), name='report-booking-funnel'),
    path('policy-violations/', PolicyViolationReportView.as_view(), name='report-policy-violations'),
    path('approval-turnaround/', ApprovalTurnaroundView.as_view(), name='report-approval-turnaround'),
]
