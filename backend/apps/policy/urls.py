from rest_framework.routers import DefaultRouter
from .views import TravelPolicyViewSet

router = DefaultRouter()
router.register('', TravelPolicyViewSet, basename='travel-policy')
urlpatterns = router.urls
