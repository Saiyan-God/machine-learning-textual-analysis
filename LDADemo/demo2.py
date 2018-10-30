# Machine learning for textual analysis using sklearn to provide the machine learning algorithm

from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.datasets import fetch_20newsgroups
from sklearn.decomposition import NMF, LatentDirichletAllocation
import pandas as pd

def display_topics(model, feature_names, no_top_words):
    for topic_idx, topic in enumerate(model.components_):
        print ("Topic %d:" % (topic_idx))
        print (" ".join([feature_names[i]
                        for i in topic.argsort()[:-no_top_words - 1:-1]]))

def get_csv_textdata(csv_filename, print_info=False):
    data = pd.read_csv(csv_filename, error_bad_lines=False)
    data_text = data[['Article']]
    data_text['index'] = data_text.index
    print('Number of Articles: {}'.format(len(data_text)))
    print('First five documents:\n{}\n'.format(data_text[:5]))
    return data_text
	
def preprocess(text):
    result = []
    for token in simple_preprocess(text):
        if token not in STOPWORDS and len(token) > 2:
            result.append(token)
    return result


def bag_of_words(processed_documents):
    # Create a dictionary from the processed documents containing the number of times a word appears in the training set
    dictionary = gensim.corpora.Dictionary(processed_documents)
    # Filter out tokens that:
    # appear in less than 15 documents
    # appear in more than 0.5 documents
    # keep only first 100 000 frequent tokens after the above two filtering steps
    dictionary.filter_extremes(no_below=15, no_above=0.5, keep_n=100000)

    bow_corpus = [dictionary.doc2bow(doc) for doc in processed_documents]

    return dictionary, bow_corpus


# Orignal Newsgroup Dataset	
#dataset = fetch_20newsgroups(shuffle=True, random_state=1, remove=('headers', 'footers', 'quotes'))
#documents = dataset.data

# Get the Smartcity dataset
dataset = get_csv_textdata('Articles.csv', print_info=True)
documents = dataset['Article'].values.tolist()

no_features = 1000

tf_vectorizer = CountVectorizer(max_df=0.95, min_df=2, max_features=no_features, stop_words='english')
tf = tf_vectorizer.fit_transform(documents)
tf_feature_names = tf_vectorizer.get_feature_names()

no_topics = 3

# Run LDA
lda = LatentDirichletAllocation(n_topics=no_topics, max_iter=5, learning_method='online', learning_offset=50.,random_state=0).fit(tf)

no_top_words = 10
display_topics(lda, tf_feature_names, no_top_words)
