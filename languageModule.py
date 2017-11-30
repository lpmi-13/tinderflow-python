from __future__ import division
from nltk.tokenize import word_tokenize
import nltk
from custom_nltk.classify import naivebayes
import json

VERB_TAG_LIST = ['VB','VBZ','VBP','VBG','VBD','VBN']
NOUN_TAG_LIST = ['NN','NNS','NNP','NNPS']
ADJECTIVE_TAG_LIST = ['JJ','JJR','JJS']
ADVERB_TAG_LIST = ['RB','RBR','RBS']
CONTENT_WORD_LIST = ['NN','NNS','NNP','NNPS','VB','VBZ','VBP','VBG','VBD','VBN','JJ','JJR','JJS','RB','RBR','RBS']


def averageWordLength(sentenceArray):
    totalWordsLength = 0
    for word in sentenceArray:
        totalWordsLength += len(word)

    return totalWordsLength / len(sentenceArray)


def longestWord(sentenceArray):
    longestWord = 0
    for word in sentenceArray:
        longestWord = len(word) if len(word) > longestWord else longestWord

    return longestWord


def returnTags(sentence):
    return nltk.pos_tag(sentence)


def lexicalDiversity(sentence):
    return len(set(sentence)) / len(sentence)


def lexicalDensity(tags):

    contentWords = [tag for (word, tag) in tags if tag in CONTENT_WORD_LIST]

    return len(contentWords) / len(tags)


def numberOfWordClass(tags, tagList):

    return len([tag for (word, tag) in tags if tag in tagList])


def languageStats(textArray):

    stats = []

    for sentence in textArray:
        sentArray = word_tokenize(sentence)
        
        tags = returnTags(sentArray)

        stats.append({
                'text' : sentence,
                'sentenceLength' : len(sentArray),
                'longestWord' : longestWord(sentArray),
                'avgWordLength' : averageWordLength(sentArray),
                'diversity' : lexicalDiversity(sentArray),
                'density' : lexicalDensity(tags),
                'nouns' : numberOfWordClass(tags, NOUN_TAG_LIST),
                'verbs' : numberOfWordClass(tags, VERB_TAG_LIST),
                'adjectives' : numberOfWordClass(tags, ADJECTIVE_TAG_LIST),
                'adverbs' : numberOfWordClass(tags, ADVERB_TAG_LIST),
                'modals' : numberOfWordClass(tags, ['MD'])
                })

    return stats

def trainModel(data):
    featureSet = []
    niceData = json.loads(data)
    for commit in niceData:
        featureSet.append(({
        'sentenceLength' : commit['sentenceLength'],
        'adjectives' : commit['adjectives'],
        'adverbs' : commit['adverbs'],
        'averageWordLength' : commit['avgWordLength'],
        'lexicalDensity' : commit['density'],
        'lexicalDiversity' : commit['diversity'],
        'longestWord' : commit['longestWord'],
        'modals' : commit['modals'],
        'nouns' : commit['nouns'],
        'verbs' : commit['verbs']
        }, commit['classification']))

    classifier = naivebayes.NaiveBayesClassifier
    return classifier.train(featureSet)

def createFeaturesFromCommit(commit):
    sentArray = word_tokenize(commit)

    tags = returnTags(sentArray)

    features = {
        'sentenceLength' : len(sentArray),
        'longestWord' : longestWord(sentArray),
        'averageWordLength' : averageWordLength(sentArray),
        'lexicalDiversity' : lexicalDiversity(sentArray),
        'lexicalDensity' : lexicalDensity(tags),
        'nouns' : numberOfWordClass(tags, NOUN_TAG_LIST),
        'verbs' : numberOfWordClass(tags, VERB_TAG_LIST),
        'adjectives' : numberOfWordClass(tags, ADJECTIVE_TAG_LIST),
        'adverbs' : numberOfWordClass(tags, ADVERB_TAG_LIST),
        'modals' : numberOfWordClass(tags, ['MD'])
    }

    return features
