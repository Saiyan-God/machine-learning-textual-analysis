from lda.api.viewsets import TopicModelViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register('lda', TopicModelViewSet)
