from django.db.models import Sum, Count, Avg, F, DurationField, ExpressionWrapper
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsFinance
from apps.bookings.models import Booking
from apps.budget.models import DepartmentBudget


class SpendByDepartmentView(APIView):
    """MIS: total approved/booked spend and remaining budget per department."""
    permission_classes = [IsAuthenticated, IsFinance]

    def get(self, request):
        spend = (
            Booking.objects.filter(status__in=['APPROVED', 'BOOKED'])
            .values('employee__department')
            .annotate(total_spend=Sum('estimated_cost'), trip_count=Count('id'))
            .order_by('-total_spend')
        )
        budgets = {b.department: b for b in DepartmentBudget.objects.all()}
        rows = []
        for row in spend:
            dept = row['employee__department'] or 'Unassigned'
            budget = budgets.get(dept)
            rows.append({
                'department': dept,
                'total_spend': row['total_spend'],
                'trip_count': row['trip_count'],
                'allocated_amount': budget.allocated_amount if budget else None,
                'remaining_amount': budget.remaining_amount if budget else None,
            })
        return Response(rows)


class BookingFunnelView(APIView):
    """MIS: count of bookings by status — for a pipeline/funnel chart."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Booking.objects.all()
        user = request.user
        if not (user.is_superuser or user.role in ('ADMIN', 'FINANCE')):
            qs = qs.filter(employee=user) if user.role == 'EMPLOYEE' else qs.filter(employee__manager=user)
        data = qs.values('status').annotate(count=Count('id')).order_by('status')
        return Response(list(data))


class PolicyViolationReportView(APIView):
    """MIS: out-of-policy bookings, for the Rule Deviation module's oversight view."""
    permission_classes = [IsAuthenticated, IsFinance]

    def get(self, request):
        qs = Booking.objects.filter(is_policy_violation=True).select_related('employee').order_by('-created_at')[:200]
        data = [
            {
                'reference': f'TRV-{b.id:05d}',
                'employee': b.employee.get_full_name() or b.employee.username,
                'department': b.employee.department,
                'status': b.status,
                'estimated_cost': b.estimated_cost,
                'policy_violation_details': b.policy_violation_details,
                'deviation_justification': b.deviation_justification,
                'created_at': b.created_at,
            }
            for b in qs
        ]
        return Response(data)


class ApprovalTurnaroundView(APIView):
    """MIS: average time (hours) from submission to final decision, overall
    and split by whether the booking was a policy violation."""
    permission_classes = [IsAuthenticated, IsFinance]

    def get(self, request):
        duration = ExpressionWrapper(F('decided_at') - F('submitted_at'), output_field=DurationField())
        qs = Booking.objects.filter(submitted_at__isnull=False, decided_at__isnull=False).annotate(turnaround=duration)
        overall = qs.aggregate(avg=Avg('turnaround'))
        by_violation = qs.values('is_policy_violation').annotate(avg=Avg('turnaround'), count=Count('id'))

        def to_hours(td):
            return round(td.total_seconds() / 3600, 1) if td else None

        return Response({
            'overall_avg_hours': to_hours(overall['avg']),
            'by_policy_violation': [
                {'is_policy_violation': r['is_policy_violation'], 'avg_hours': to_hours(r['avg']), 'count': r['count']}
                for r in by_violation
            ],
        })
