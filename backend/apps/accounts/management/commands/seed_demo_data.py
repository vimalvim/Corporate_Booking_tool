"""
Seeds the database with realistic mock data covering every module, so the
app is demoable immediately after `migrate`. Idempotent-ish: re-running
resets and recreates the demo dataset (existing demo users/records with the
same natural keys are updated, not duplicated).

Usage: python manage.py seed_demo_data
"""
from datetime import date, timedelta
from django.utils import timezone as dj_timezone
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.accounts.models import User
from apps.employees.models import EmployeeProfile
from apps.policy.models import TravelPolicy
from apps.budget.models import DepartmentBudget
from apps.approvals.models import ApprovalMatrixRule
from apps.bookings.models import Booking, BookingItem
from apps.payments.models import PaymentMethod
from apps.approvals.services import build_approval_chain, act_on_approval


class Command(BaseCommand):
    help = 'Seed demo/mock data for the Corporate Travel Booking Tool.'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write('Seeding demo data...')

        admin = self._user('ADM001', 'admin', 'ADMIN', 'Priya', 'Raman', 'Corporate Admin', is_superuser=True)
        finance = self._user('FIN001', 'finance', 'FINANCE', 'Arjun', 'Nair', 'Finance')
        mgr_eng = self._user('MGR001', 'karthik.mgr', 'MANAGER', 'Karthik', 'Subramaniam', 'Engineering')
        mgr_sales = self._user('MGR002', 'divya.mgr', 'MANAGER', 'Divya', 'Menon', 'Sales')

        emp1 = self._user('EMP101', 'vimal.emp', 'EMPLOYEE', 'Vimal', 'Kumar', 'Engineering', manager=mgr_eng)
        emp2 = self._user('EMP102', 'anitha.emp', 'EMPLOYEE', 'Anitha', 'Suresh', 'Engineering', manager=mgr_eng)
        emp3 = self._user('EMP201', 'rahul.emp', 'EMPLOYEE', 'Rahul', 'Verma', 'Sales', manager=mgr_sales)

        profiles = {
            admin: ('L5', 'Head of Admin', 'CC-ADM'),
            finance: ('L4', 'Finance Manager', 'CC-FIN'),
            mgr_eng: ('L4', 'Engineering Manager', 'CC-ENG'),
            mgr_sales: ('L4', 'Sales Manager', 'CC-SAL'),
            emp1: ('L2', 'Software Engineer', 'CC-ENG'),
            emp2: ('L3', 'Senior Software Engineer', 'CC-ENG'),
            emp3: ('L2', 'Sales Executive', 'CC-SAL'),
        }
        for user, (grade, designation, cc) in profiles.items():
            EmployeeProfile.objects.update_or_create(
                user=user,
                defaults=dict(designation=designation, grade=grade, cost_center=cc, base_city='Chennai'),
            )

        # --- Travel policy (per grade x trip type) ---------------------------------
        policy_rows = [
            ('L2', 'DOMESTIC', 'ECONOMY', 12000, 3, 6000, 3),
            ('L2', 'INTERNATIONAL', 'ECONOMY', 90000, 3, 12000, 7),
            ('L3', 'DOMESTIC', 'ECONOMY', 15000, 4, 8000, 3),
            ('L3', 'INTERNATIONAL', 'PREMIUM_ECONOMY', 130000, 4, 16000, 5),
            ('L4', 'DOMESTIC', 'BUSINESS', 25000, 4, 12000, 2),
            ('L4', 'INTERNATIONAL', 'BUSINESS', 220000, 5, 25000, 5),
            ('L5', 'DOMESTIC', 'BUSINESS', 35000, 5, 18000, 1),
            ('L5', 'INTERNATIONAL', 'FIRST', 350000, 5, 35000, 3),
        ]
        for grade, trip, cls, fare, stars, hotel, days in policy_rows:
            TravelPolicy.objects.update_or_create(
                grade=grade, trip_type=trip,
                defaults=dict(
                    name=f'{grade} {trip.title()} Policy', max_flight_class=cls, max_flight_fare=fare,
                    max_hotel_category_stars=stars, max_hotel_price_per_night=hotel,
                    advance_booking_days_required=days,
                ),
            )

        # --- Budgets -----------------------------------------------------------------
        fy = self._current_fy()
        for dept, amount in [('Engineering', 2_000_000), ('Sales', 1_500_000), ('Corporate Admin', 500_000), ('Finance', 400_000)]:
            DepartmentBudget.objects.update_or_create(
                department=dept, fiscal_year=fy, defaults=dict(allocated_amount=amount),
            )

        # --- Approval matrix -----------------------------------------------------------
        ApprovalMatrixRule.objects.all().delete()
        ApprovalMatrixRule.objects.bulk_create([
            ApprovalMatrixRule(level=1, min_amount=0, max_amount=None, approver_role='MANAGER'),
            ApprovalMatrixRule(level=2, min_amount=50000, max_amount=None, approver_role='FINANCE'),
            ApprovalMatrixRule(level=3, min_amount=0, max_amount=None, approver_role='FINANCE', applies_to_violation_only=True),
        ])

        # --- Payment methods -------------------------------------------------------
        PaymentMethod.objects.update_or_create(
            label='Corporate Amex - Engineering', method_type='CORPORATE_CARD',
            defaults=dict(masked_identifier='**** 4821', department='Engineering'),
        )
        PaymentMethod.objects.update_or_create(
            label='Corporate Amex - Sales', method_type='CORPORATE_CARD',
            defaults=dict(masked_identifier='**** 7734', department='Sales'),
        )
        PaymentMethod.objects.update_or_create(
            label='Travel Desk Direct Billing', method_type='DIRECT_BILLING',
            defaults=dict(department=''),
        )

        # --- Sample bookings across the lifecycle -----------------------------------
        Booking.objects.filter(employee__in=[emp1, emp2, emp3]).delete()

        b1 = Booking.objects.create(
            employee=emp1, trip_type='DOMESTIC', purpose='Client workshop in Bengaluru',
            origin='Chennai', destination='Bengaluru',
            start_date=date.today() + timedelta(days=10), end_date=date.today() + timedelta(days=12),
            status='DRAFT',
        )
        BookingItem.objects.create(booking=b1, item_type='FLIGHT', provider='IndiGo', class_or_category='ECONOMY', details='6E-204', cost=Decimal('6500'))
        BookingItem.objects.create(booking=b1, item_type='HOTEL', provider='Ibis', class_or_category='3-star', details='Ibis Bengaluru Outer Ring Rd', cost=Decimal('4200'), quantity=2)
        b1.estimated_cost = sum(i.cost * i.quantity for i in b1.items.all())
        b1.save()

        b2 = Booking.objects.create(
            employee=emp2, trip_type='DOMESTIC', purpose='Annual sales kickoff',
            origin='Chennai', destination='Mumbai',
            start_date=date.today() + timedelta(days=20), end_date=date.today() + timedelta(days=22),
            status='DRAFT',
        )
        BookingItem.objects.create(booking=b2, item_type='FLIGHT', provider='Vistara', class_or_category='ECONOMY', details='UK-955', cost=Decimal('8200'))
        BookingItem.objects.create(booking=b2, item_type='HOTEL', provider='Taj', class_or_category='5-star', details='Taj Lands End', cost=Decimal('14000'), quantity=2)
        b2.estimated_cost = sum(i.cost * i.quantity for i in b2.items.all())
        b2.save()
        b2.is_policy_violation, b2.policy_violation_details = True, 'Hotel rate ₹14000/night exceeds policy cap ₹8000/night.'
        b2.deviation_justification = 'No 3-star inventory available near the venue during the kickoff dates.'
        b2.status = 'PENDING_APPROVAL'
        b2.submitted_at = dj_timezone.now()
        b2.save()
        build_approval_chain(b2)

        b3 = Booking.objects.create(
            employee=emp3, trip_type='DOMESTIC', purpose='Customer renewal visit',
            origin='Chennai', destination='Hyderabad',
            start_date=date.today() + timedelta(days=5), end_date=date.today() + timedelta(days=6),
            status='DRAFT',
        )
        BookingItem.objects.create(booking=b3, item_type='TRAIN', provider='IRCTC', class_or_category='AC 2-Tier', details='Charminar Express', cost=Decimal('1800'))
        BookingItem.objects.create(booking=b3, item_type='CAB', provider='Ola Corporate', class_or_category='Sedan', details='Airport transfer', cost=Decimal('900'), quantity=2)
        b3.estimated_cost = sum(i.cost * i.quantity for i in b3.items.all())
        b3.status = 'PENDING_APPROVAL'
        b3.submitted_at = dj_timezone.now()
        b3.save()
        build_approval_chain(b3)
        first_step = b3.approvals.filter(level=1).first()
        if first_step:
            act_on_approval(first_step, actor=mgr_sales, decision='APPROVED', comments='Approved, standard renewal travel.')

        self.stdout.write(self.style.SUCCESS(
            'Done. Login with username=admin / finance / karthik.mgr / divya.mgr / vimal.emp / anitha.emp / rahul.emp, password=Passw0rd!123'
        ))

    def _user(self, code, username, role, first, last, department, manager=None, is_superuser=False):
        user, _ = User.objects.update_or_create(
            username=username,
            defaults=dict(
                employee_code=code, role=role, first_name=first, last_name=last,
                department=department, manager=manager, email=f'{username}@demo-corp.example',
                is_staff=is_superuser, is_superuser=is_superuser,
            ),
        )
        user.set_password('Passw0rd!123')
        user.save()
        return user

    @staticmethod
    def _current_fy():
        today = date.today()
        start_year = today.year if today.month >= 4 else today.year - 1
        return f'{start_year}-{start_year + 1}'
