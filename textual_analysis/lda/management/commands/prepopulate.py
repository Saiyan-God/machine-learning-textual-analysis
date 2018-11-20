import json
from django.core.management.base import BaseCommand
from lda.models import TopicModel
from utils.demo import LDAModel


class Command(BaseCommand):
    def _create_tags(self):
        model = LDAModel('utils/articles/Articles.csv')
        model.train_model()
        # Useless rn
        model.save_model()

        list_of_topics = model.trained_model.show_topics(num_topics=3, num_words=5)

        first_model = TopicModel()
        first_model.model_name = 'Test Model'
        first_model.model_topics = json.dumps(list_of_topics)
        first_model.save()

    def handle(self, *args, **options):
        self._create_tags()
