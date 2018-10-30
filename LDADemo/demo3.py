import gensim
import pandas as pd
from gensim.utils import simple_preprocess
from gensim.parsing.preprocessing import STOPWORDS

#NTLK
import re
from nltk.tokenize import word_tokenize
import string
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()

def get_csv_textdata(csv_filename, print_info=False):
    data = pd.read_csv(csv_filename, error_bad_lines=False)
    data_text = data[['Article']]
    data_text['index'] = data_text.index
    return data_text

def preprocess(text):
    result = []
    # for token in simple_preprocess(text):
    #     if token not in STOPWORDS and len(token) > 2:
    #         result.append(token)
    tokens = word_tokenize(re.sub(r'\d+', '', text.lower().strip().translate(string.maketrans("",""), string.punctuation)))
    return [i for i in tokens if not i in STOPWORDS]


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


def main():
    # Retrieve training data
    documents = get_csv_textdata('Articles2.csv', print_info=True)
    print('Number of Articles: {}'.format(len(documents)))
    print('First five documents:\n{}\n'.format(documents[:5]))

    # Process data
    processed_docs = documents['Article'].map(preprocess)
    print('First five documents processed:\n{}\n'.format(processed_docs[:5]))

    dictionary, bow_corpus = bag_of_words(processed_docs)

    # Run LDA model with training data
    lda_model = gensim.models.LdaMulticore(bow_corpus, num_topics=3, id2word=dictionary, passes=100, workers=3)
    for idx, topic in lda_model.print_topics(-1):
        print('Topic: {} \nWords: {}'.format(idx, topic))
    print('\n')

    # Read LL File
    with open('LLKasserinePass.txt', 'r') as myfile:
        lldata = myfile.read().replace('\n', '')

    # Test model with LL Document
    bow_vector = dictionary.doc2bow(preprocess(lldata))
    for index, score in sorted(lda_model[bow_vector], key=lambda tup: -1*tup[1]):
        print("Score: {}\t Topic: {}".format(score, lda_model.print_topic(index, 5)))
    print('\n')


if __name__ == "__main__":
    main()

