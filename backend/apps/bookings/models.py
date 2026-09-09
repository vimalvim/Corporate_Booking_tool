from django.conf import settings
from django.db import models


class Booking(models.Model):
    """
    Travel Booking module — the central record of a trip request. Carries
    its own lifecycle status, and links out to Approval records (approvals
    app) and Payment records (payments app). Policy-violation fields double
    as the Rule Deviation / Out-of-Policy Management module: when a booking
    breaches the matching TravelPolicy, `is_policy_violation` is set and the
    employee must supply `deviation_justification` before it can be
    submitted for approval.
    """

    class TripType(models.TextChoices):
        DOMESTIC = 'DOMESTIC', 'Domestic'
        INTERNATIONAL = 'INTERNATIONAL', 'International'

    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PENDING_APPROVAL = 'PENDING_APPROVAL', 'Pending Approval'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        BOOKED = 'BOOKED', 'Booked'
        CANCELLED = 'CANCELLED', 'Cancelled'

    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    trip_type = models.CharField(max_length=20, choices=TripType.choices)
    purpose = models.CharField(max_length=255)
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)

    estimated_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    is_policy_violation = models.BooleanField(default=False)
    policy_violation_details = models.TextField(blank=True)
    deviation_justification = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    decided_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.employee.employee_code} | {self.origin} -> {self.destination}'


class BookingItem(models.Model):
    """A single bookable component of a trip (flight leg, hotel stay, train,
    cab). Kept generic via `item_type` + free-form `details` so the demo
    doesn't need real GDS integration — a real system would replace
    `details` with structured fields per provider response."""

    class ItemType(models.TextChoices):
        FLIGHT = 'FLIGHT', 'Flight'
        HOTEL = 'HOTEL', 'Hotel'
        TRAIN = 'TRAIN', 'Train'
        CAB = 'CAB', 'Cab'

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='items')
    item_type = models.CharField(max_length=20, choices=ItemType.choices)
    provider = models.CharField(max_length=100, blank=True)
    class_or_category = models.CharField(max_length=50, blank=True, help_text='e.g. Economy, 4-star')
    details = models.CharField(max_length=255, blank=True, help_text='e.g. flight number, hotel name')
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveSmallIntegerField(default=1)

    def __str__(self):
        return f'{self.item_type} for booking #{self.booking_id}'
