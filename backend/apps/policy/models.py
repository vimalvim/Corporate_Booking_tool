from django.db import models


class TravelPolicy(models.Model):
    """
    Travel Policy Configuration module. One row per (grade, trip type)
    combination — e.g. "L2 Domestic" allows Economy flights up to
    INR 12,000 and 3-star hotels up to INR 6,000/night. Bookings are
    checked against the matching policy in apps.bookings.services.
    """

    class TripType(models.TextChoices):
        DOMESTIC = 'DOMESTIC', 'Domestic'
        INTERNATIONAL = 'INTERNATIONAL', 'International'

    class FlightClass(models.TextChoices):
        ECONOMY = 'ECONOMY', 'Economy'
        PREMIUM_ECONOMY = 'PREMIUM_ECONOMY', 'Premium Economy'
        BUSINESS = 'BUSINESS', 'Business'
        FIRST = 'FIRST', 'First'

    name = models.CharField(max_length=120)
    grade = models.CharField(max_length=2)  # matches EmployeeProfile.Grade
    trip_type = models.CharField(max_length=20, choices=TripType.choices)
    max_flight_class = models.CharField(max_length=20, choices=FlightClass.choices, default=FlightClass.ECONOMY)
    max_flight_fare = models.DecimalField(max_digits=10, decimal_places=2)
    max_hotel_category_stars = models.PositiveSmallIntegerField(default=3)
    max_hotel_price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    max_train_class = models.CharField(max_length=20, default='AC 2-Tier')
    advance_booking_days_required = models.PositiveSmallIntegerField(default=3)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('grade', 'trip_type')
        ordering = ['grade', 'trip_type']

    def __str__(self):
        return self.name
