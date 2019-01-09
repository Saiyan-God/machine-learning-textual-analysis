from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.datasets import fetch_20newsgroups
from sklearn.decomposition import NMF, LatentDirichletAllocation
import pandas as pd
import numpy as np

def display_topics(model, feature_names, no_top_words):
    for topic_idx, topic in enumerate(model.components_):
        print ("Topic %d:" % (topic_idx))
        print (" ".join([feature_names[i]
                        for i in topic.argsort()[:-no_top_words - 1:-1]]))

def get_csv_textdata(csv_filename, print_info=False):
    data = pd.read_csv(csv_filename, error_bad_lines=False)
    data_text = data[['Article']]
#    data_text['index'] = data_text.index
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
dataset = get_csv_textdata('ColdWarDataTraining3.csv', print_info=True)
documents = dataset['Article'].values.tolist()

no_features = 50

# LDA can only use raw term counts for LDA because it is a probabilistic graphical model
tf_vectorizer = CountVectorizer(max_df=0.8, min_df=0.2, max_features=no_features, stop_words='english', decode_error='ignore')
tf = tf_vectorizer.fit_transform(documents)
tf_feature_names = tf_vectorizer.get_feature_names()

no_topics = 2

#print('First five documents:\n{}\n'.format(tf[:5]))

# Run LDA
lda = LatentDirichletAllocation(n_topics=no_topics, max_iter=5, learning_method='online', learning_offset=50.,random_state=0).fit(tf)

no_top_words = 15
display_topics(lda, tf_feature_names, no_top_words)

test_data = get_csv_textdata('ColdWarDataTest3.csv', print_info=True)
test_documents = test_data['Article'].values.tolist()

#tf_test_vectorizer = CountVectorizer(max_df=0.95, min_df=2, max_features=no_features, stop_words='english', decode_error='ignore')
test_tf = tf_vectorizer.fit_transform(test_documents)
test_output = lda.transform(test_tf)

print('Predict {}: {}'.format(len(np.squeeze(np.asarray(test_output.argmax(axis=1)))), np.squeeze(np.asarray(test_output.argmax(axis=1)))[0:9]))
