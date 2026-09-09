from rest_framework.routers import DefaultRouter
from .views import ApprovalMatrixRuleViewSet, ApprovalViewSet

router = DefaultRouter()
router.register('matrix', ApprovalMatrixRuleViewSet, basename='approval-matrix')
router.register('', ApprovalViewSet, basename='approval')
urlpatterns = router.urls
