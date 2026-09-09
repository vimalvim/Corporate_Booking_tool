from rest_framework.routers import DefaultRouter
from .views import DepartmentBudgetViewSet

router = DefaultRouter()
router.register('', DepartmentBudgetViewSet, basename='department-budget')
urlpatterns = router.urls
