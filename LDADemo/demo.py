import os
import gensim
import warnings
import pyLDAvis.gensim
import pandas as pd
from gensim.utils import simple_preprocess
from gensim.parsing.preprocessing import STOPWORDS
from nltk.stem import WordNetLemmatizer, SnowballStemmer
from nltk.stem.porter import *

import nltk
nltk.download('wordnet')

warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=FutureWarning)


def get_csv_textdata(csv_filename, print_info=False):
    data = pd.read_csv(csv_filename, error_bad_lines=False, encoding="ISO-8859-1")
    data_text = data[['Article']]
    data_text['index'] = data_text.index
    return data_text


def annoyingSnake(directory_name):
    file_arr = []
    for file in os.listdir(directory_name):
        if file.endswith(".txt"):
            file_arr.append(file)

    print(file_arr)

    lol = []
    for file in file_arr:
        with open('NewMilitaryTextFiles/' + file, 'r', encoding='ISO-8859-1') as myfile:
            lol.append(myfile.read().replace('\n', ' '))
    return lol


def lemmatize_stemming(text):
    stemmer = SnowballStemmer("english")
    return stemmer.stem(WordNetLemmatizer().lemmatize(text, pos='v'))


def preprocess(text):
    result = []
    for token in simple_preprocess(text):
        if token not in STOPWORDS and len(token) > 3:
            result.append(lemmatize_stemming(token))
    return result


def bag_of_words(processed_documents):
    # Create a dictionary from the processed documents containing the number of times a word appears in the training set
    dictionary = gensim.corpora.Dictionary(processed_documents)
    # Filter out tokens that:
    # appear in less than 15 documents
    # appear in more than 0.5 documents
    # keep only first 100 000 frequent tokens after the above two filtering steps
    dictionary.filter_extremes(no_below=0, no_above=0.5)
    bow_corpus = [dictionary.doc2bow(doc) for doc in processed_documents]

    return dictionary, bow_corpus


def visualize_model(model, corpus, dictionary):
    visualization = prepared_for_vis = pyLDAvis.gensim.prepare(model, corpus, dictionary)
    pyLDAvis.save_html(visualization, 'LDA_Visualization.html')


def main():
    # Retrieve training data
    #documents = annoyingSnake('/home/hassheez/PycharmProjects/machine-learning-textual-analysis/LDADemo/NewMilitaryTextFiles')
    documents = annoyingSnake('NewMilitaryTextFiles')
    print('Number of Articles: {}'.format(len(documents)))
    #print('First five documents:\n{}\n'.format(documents[:5]))

    # Process data
    series_docs = pd.Series(documents, name="Article")
    processed_docs = series_docs.map(preprocess)
    print(type(processed_docs))
    print('First five documents processed:\n{}\n'.format(processed_docs[:5]))

    dictionary, bow_corpus = bag_of_words(processed_docs)
    #print(dictionary)
    #print(bow_corpus)
    # Run LDA model with training data
    lda_model = gensim.models.LdaMulticore(bow_corpus, num_topics=2, id2word=dictionary, passes=50, workers=3)
    for idx, topic in lda_model.print_topics(-1):
        print('Topic: {} \nWords: {}'.format(idx, topic))
    print('\n')

    # Read LL File
    with open('LLDocument.txt', 'r') as myfile:
        lldata = myfile.read().replace('\n', '')

    # Test model with LL Document
    bow_vector = dictionary.doc2bow(preprocess(lldata))
    for index, score in sorted(lda_model[bow_vector], key=lambda tup: -1*tup[1]):
        print("Score: {}\t Topic: {}".format(score, lda_model.print_topic(index, 5)))
    print('\n')

    # Visualize LDA model with pyLDAvis
    visualize_model(lda_model, bow_corpus, dictionary)


if __name__ == "__main__":
    main()
