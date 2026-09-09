from django.contrib import admin
from .models import Booking, BookingItem


class BookingItemInline(admin.TabularInline):
    model = BookingItem
    extra = 0


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'employee', 'trip_type', 'status', 'estimated_cost', 'is_policy_violation']
    list_filter = ['status', 'trip_type', 'is_policy_violation']
    inlines = [BookingItemInline]
