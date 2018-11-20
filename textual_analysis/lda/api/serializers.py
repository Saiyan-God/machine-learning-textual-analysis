from rest_framework import serializers
from lda.models import TopicModel


class TopicModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = TopicModel
        fields = '__all__'
