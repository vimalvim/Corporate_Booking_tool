from rest_framework.routers import DefaultRouter
from .views import PaymentMethodViewSet, PaymentViewSet

router = DefaultRouter()
router.register('methods', PaymentMethodViewSet, basename='payment-method')
router.register('', PaymentViewSet, basename='payment')
urlpatterns = router.urls
