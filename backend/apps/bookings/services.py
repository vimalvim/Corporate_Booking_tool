"""
Core business rules for the booking lifecycle:
  1. check_policy_violation — compares booking items against the employee's
     matching TravelPolicy (Rule Deviation / Out-of-Policy Management).
  2. apply_budget_delta — moves money in/out of the employee's department
     budget when a booking is approved or cancelled (Budget Management).
"""
from apps.policy.models import TravelPolicy


FLIGHT_CLASS_RANK = {
    'ECONOMY': 1,
    'PREMIUM_ECONOMY': 2,
    'BUSINESS': 3,
    'FIRST': 4,
}


def get_matching_policy(booking):
    grade = getattr(getattr(booking.employee, 'profile', None), 'grade', None)
    if not grade:
        return None
    return TravelPolicy.objects.filter(
        grade=grade, trip_type=booking.trip_type, is_active=True
    ).first()


def check_policy_violation(booking):
    """
    Evaluates every BookingItem against the matching TravelPolicy.
    Returns (is_violation: bool, details: str). Does not save the booking —
    the caller decides when to persist (submit-time).
    """
    policy = get_matching_policy(booking)
    if not policy:
        return False, ''

    reasons = []
    for item in booking.items.all():
        if item.item_type == 'FLIGHT':
            item_rank = FLIGHT_CLASS_RANK.get((item.class_or_category or 'ECONOMY').upper().replace(' ', '_'), 1)
            policy_rank = FLIGHT_CLASS_RANK.get(policy.max_flight_class, 1)
            if item_rank > policy_rank:
                reasons.append(
                    f'Flight class "{item.class_or_category}" exceeds policy limit "{policy.get_max_flight_class_display()}".'
                )
            if item.cost > policy.max_flight_fare:
                reasons.append(f'Flight cost ₹{item.cost} exceeds policy cap ₹{policy.max_flight_fare}.')
        elif item.item_type == 'HOTEL':
            if item.cost > policy.max_hotel_price_per_night:
                reasons.append(f'Hotel rate ₹{item.cost}/night exceeds policy cap ₹{policy.max_hotel_price_per_night}/night.')

    is_violation = bool(reasons)
    return is_violation, ' '.join(reasons)


def apply_budget_delta(booking, sign: int):
    """sign=+1 to consume budget (on approval), -1 to release it (on
    cancellation of a previously-approved booking)."""
    from apps.budget.models import DepartmentBudget
    from django.utils import timezone

    fiscal_year = _current_fiscal_year()
    department = booking.employee.department or 'Unassigned'
    budget, _ = DepartmentBudget.objects.get_or_create(
        department=department, fiscal_year=fiscal_year,
        defaults={'allocated_amount': 0},
    )
    budget.used_amount = max(0, budget.used_amount + sign * booking.estimated_cost)
    budget.save(update_fields=['used_amount'])


def _current_fiscal_year():
    from datetime import date
    today = date.today()
    # Indian fiscal year: Apr 1 - Mar 31
    start_year = today.year if today.month >= 4 else today.year - 1
    return f'{start_year}-{start_year + 1}'
