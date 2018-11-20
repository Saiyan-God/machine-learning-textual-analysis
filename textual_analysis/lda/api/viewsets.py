from lda.models import TopicModel
from .serializers import TopicModelSerializer
from rest_framework import viewsets
from django_filters import rest_framework as filters


class TopicModelFilter(filters.FilterSet):
    model_name = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = TopicModel
        fields = ('model_name',)


class TopicModelViewSet(viewsets.ModelViewSet):
    queryset = TopicModel.objects.all()
    serializer_class = TopicModelSerializer
    filterset_class = TopicModelFilter
