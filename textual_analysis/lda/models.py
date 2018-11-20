from django.db import models


# Create your models here.
class TopicModel(models.Model):
    model_name = models.CharField(max_length=100)
    model_topics = models.TextField(max_length=1000)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.model_name
