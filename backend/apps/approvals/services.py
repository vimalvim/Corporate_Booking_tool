"""
Business logic for turning the configured Approval Matrix into concrete
Approval rows on a booking, and for resolving the chain when each level is
actioned. Kept separate from views/models so both `bookings` and
`approvals` views can call the same functions without duplicating logic.
"""
from django.utils import timezone

from .models import ApprovalMatrixRule, Approval


def build_approval_chain(booking):
    """Create Approval rows for a booking based on matching matrix rules.
    Called once, when a booking moves DRAFT -> PENDING_APPROVAL."""
    Approval.objects.filter(booking=booking).delete()

    amount = booking.estimated_cost
    rules = ApprovalMatrixRule.objects.filter(is_active=True).order_by('level')
    matching = []
    for rule in rules:
        if rule.applies_to_violation_only and not booking.is_policy_violation:
            continue
        if amount < rule.min_amount:
            continue
        if rule.max_amount is not None and amount > rule.max_amount:
            continue
        matching.append(rule)

    if not matching:
        # No rule configured for this amount band: fall back to a single
        # manager approval so nothing silently skips review.
        Approval.objects.create(booking=booking, level=1, approver_role='MANAGER')
        return

    for rule in matching:
        Approval.objects.create(booking=booking, level=rule.level, approver_role=rule.approver_role)


def resolve_approver_for(approval):
    """Return the User who should act on a given Approval step."""
    booking = approval.booking
    if approval.approver_role == 'MANAGER':
        return booking.employee.manager
    # FINANCE / ADMIN steps can be actioned by any user holding that role;
    # resolved at action-time via permission check rather than a fixed user.
    return None


def act_on_approval(approval, actor, decision, comments=''):
    """decision: 'APPROVED' or 'REJECTED'. Returns the updated booking status."""
    from apps.bookings.models import Booking
    from apps.bookings.services import apply_budget_delta

    approval.status = decision
    approval.approver = actor
    approval.comments = comments
    approval.acted_at = timezone.now()
    approval.save()

    booking = approval.booking

    if decision == Approval.Status.REJECTED:
        remaining = booking.approvals.exclude(pk=approval.pk)
        remaining.filter(status=Approval.Status.PENDING).update(status=Approval.Status.SKIPPED)
        booking.status = Booking.Status.REJECTED
        booking.decided_at = timezone.now()
        booking.save(update_fields=['status', 'decided_at'])
        return booking.status

    still_pending = booking.approvals.filter(status=Approval.Status.PENDING).exists()
    if not still_pending:
        booking.status = Booking.Status.APPROVED
        booking.decided_at = timezone.now()
        booking.save(update_fields=['status', 'decided_at'])
        apply_budget_delta(booking, sign=+1)
    return booking.status
