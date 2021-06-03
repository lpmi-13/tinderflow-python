import logging
import os
import sys

import requests
from flask import Flask, render_template, request, jsonify
from flask_talisman import Talisman

from dataStore import textArray
from languageModule import languageStats 
from languageModule import trainModel
from languageModule import createFeaturesFromCommit

logging.basicConfig(level=logging.DEBUG)
_logger = logging.getLogger(__name__)


def create_app():
    application = Flask(__name__)

    return application


app = create_app()
Talisman(app)


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/data')
def send_initial_data():

    return jsonify(languageStats(textArray))

@app.route('/train', methods=['POST'])
def collect_data_for_training_model():

    global classifier
    classifier = trainModel(request.data)

    stats = classifier.show_most_informative_features(10)
    return jsonify({'stats' : stats})

@app.route('/classify', methods=['POST'])
def classify_commit():
    _logger.debug('Classifying a new instance with our trained model')

    commit = request.data

    features = createFeaturesFromCommit(commit)
    return classifier.classify(features)

if __name__ == "__main__":
    app.run(debug=True, port=5002)
