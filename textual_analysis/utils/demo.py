import gensim
import warnings
import pyLDAvis.gensim
import pandas as pd
from gensim.utils import simple_preprocess
from gensim.parsing.preprocessing import STOPWORDS

warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=FutureWarning)


class LDAModel:

    def __init__(self, corpus_filepath):
        self.corpus_filepath = corpus_filepath
        self.trained_model = None

    @staticmethod
    def _get_csv_textdata(csv_filename):
        print(csv_filename)
        data = pd.read_csv(csv_filename, error_bad_lines=False)
        data_text = data[['Article']]
        data_text['index'] = data_text.index
        return data_text

    @staticmethod
    def _preprocess(text):
        result = []
        for token in simple_preprocess(text):
            if token not in STOPWORDS and len(token) > 2:
                result.append(token)
        return result

    @staticmethod
    def _bag_of_words(processed_documents):
        # Create a dictionary from the processed documents containing the # of times a word appears in the training set
        dictionary = gensim.corpora.Dictionary(processed_documents)
        # Filter out tokens that:
        # appear in less than 15 documents
        # appear in more than 0.5 documents
        # keep only first 100 000 frequent tokens after the above two filtering steps
        dictionary.filter_extremes(no_below=15, no_above=0.5, keep_n=100000)

        bow_corpus = [dictionary.doc2bow(doc) for doc in processed_documents]

        return dictionary, bow_corpus

    @staticmethod
    def visualize_model(corpus, dictionary):
        visualization = pyLDAvis.gensim.prepare(model, corpus, dictionary)
        pyLDAvis.save_html(visualization, 'LDA_Visualization.html')

    def train_model(self):
        if not self.corpus_filepath:
            print('No specified training corpus')
        # Retrieve training corpus
        documents = self._get_csv_textdata(self.corpus_filepath)
        print('Number of Articles: {}'.format(len(documents)))
        print('First five documents:\n{}\n'.format(documents[:5]))

        # Process documents
        processed_docs = documents['Article'].map(self._preprocess)
        print('First five documents processed:\n{}\n'.format(processed_docs[:5]))

        # Get bag of words model
        dictionary, bow_corpus = self._bag_of_words(processed_docs)

        # Run LDA model with training data
        self.trained_model = gensim.models.LdaMulticore(bow_corpus, num_topics=3, id2word=dictionary, passes=10, workers=3)

        for idx, topic in self.trained_model.print_topics(-1):
            print('Topic: {} \nWords: {}'.format(idx, topic))
        print('\n')

    def save_model(self):
        if self.trained_model:
            self.trained_model.save('utils/saved_models/lda.model')


# def main():
#
#     # Read LL File
#     with open('SmartTrafficArt.txt', 'r') as myfile:
#         lldata = myfile.read().replace('\n', '')
#
#     # Test model with LL Document
#     bow_vector = dictionary.doc2bow(preprocess(lldata))
#     for index, score in sorted(lda_model[bow_vector], key=lambda tup: -1*tup[1]):
#         print("Score: {}\t Topic: {}".format(score, lda_model.print_topic(index, 5)))
#     print('\n')
#
#     # Visualize LDA model with pyLDAvis
#     visualize_model(lda_model, bow_corpus, dictionary)
#
#
# if __name__ == "__main__":
#     main()
