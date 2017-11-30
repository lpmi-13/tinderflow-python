var app = angular.module('tinderflow', ['ngResource', 'ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: '/static/templates/home.html',
            controller : 'HomeCtrl'
        })
        .when('/demo', {
            templateUrl: '/static/templates/demo.html',
            controller : 'DemoCtrl'
        })
        .when('/classify', {
            templateUrl: '/static/templates/classify.html',
            controller : 'ClassifyCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$location',
	function ($scope, $location) {

            $scope.goToHome = function() {
                $location.path('/');
            }

            $scope.goToDemo = function() {
                $location.path('/demo');
            }

            $scope.goToClassify = function() {
                $location.path('/classify');
            }


}]);

app.controller('DemoCtrl', ['$scope', '$resource', '$location', '$http', '$timeout',
    function ($scope, $resource, $location, $http, $timeout) {

            $scope.goToHome = function() {
                $location.path('/');
            }

            $scope.goToDemo = function() {
                $location.path('/demo');
            }

            $scope.goToClassify = function() {
                $location.path('/classify');
            }


	    $scope.goodOnes = {
		    'avgSentenceLength':0,
		    'avgLongestWord':0,
		    'avgWordLength':0,
		    'avgDiversity':0,
		    'avgDensity':0,
		    'avgNouns':0,
		    'avgVerbs':0,
		    'avgAdjectives':0,
		    'avgAdverbs':0,
		    'avgModals':0
	    };
	    $scope.badOnes = {
		    'avgSentenceLength':0,
		    'avgLongestWord':0,
		    'avgWordLength':0,
		    'avgDiversity':0,
		    'avgDensity':0,
		    'avgNouns':0,
		    'avgVerbs':0,
		    'avgAdjectives':0,
		    'avgAdverbs':0,
		    'avgModals':0
	    };

            $scope.currentCommit;

            var dataObject = [];
            var trainingDataObject = [];

            $scope.sendingData = true;
            dataUrl = '/data';

            var getData = function() {
                $scope.sendingData = true;
                $http.get(dataUrl)
                    .success(function(response, status) {
                        for(var i = 0; i < response.length; i++) {
                            dataObject.push(response[i]);
                        }
                        $scope.currentCommit = dataObject.shift();
                        $scope.sendingData = false;
                    })
                        .error(function(data, status) {
                        console.log('error');
                    });
            }

            $scope.classifyGoodCommit = function() {
                $scope.currentCommit.classification = 'good';
                //this will be the training data to send to python
                trainingDataObject.push($scope.currentCommit);
//                console.log($scope.currentCommit);
                updateAverages($scope.currentCommit, $scope.currentCommit.classification);
                var commitMessageToAdd = dataObject.shift();
                $scope.currentCommit = commitMessageToAdd;
//                console.log(trainingDataObject);
//                console.log(goodAverageValueHolder);
            }

            $scope.classifyBadCommit = function() {
                $scope.currentCommit.classification = 'bad';
                //this will be the training data to send to python
                trainingDataObject.push($scope.currentCommit);
//                console.log($scope.currentCommit);
                updateAverages($scope.currentCommit, $scope.currentCommit.classification);
                var commitMessageToAdd = dataObject.shift();
                $scope.currentCommit = commitMessageToAdd;
//                console.log(trainingDataObject);
//                console.log(badAverageValueHolder);
            }

            var url = '/train';

            $scope.stats = false;
            $scope.waiting = false;

            $scope.sendTrainingData = function() {
                $scope.loading = true;
                console.log('sending training data');
                $http.post(url, trainingDataObject)
                    .success(function(data, status) {
                        console.log(data);

                        $scope.statistics = data['stats'];
                        $scope.loading = false;
                        $scope.stats = true;
                    })
                    .error(function(data, status) {
                    console.log('error');
                    });
            }

            var goodAverageValueHolder = {
                'avgSentenceLength':0,
                'avgLongestWord':0,
                'avgWordLength':0,
                'avgDiversity':0,
                'avgDensity':0,
                'avgNouns':0,
                'avgVerbs':0,
                'avgAdjectives':0,
                'avgAdverbs':0,
                'avgModals':0,
                'total':0
            };

            var badAverageValueHolder = {
                'avgSentenceLength':0,
                'avgLongestWord':0,
                'avgWordLength':0,
                'avgDiversity':0,
                'avgDensity':0,
                'avgNouns':0,
                'avgVerbs':0,
                'avgAdjectives':0,
                'avgAdverbs':0,
                'avgModals':0,
                'total':0
            };

            updateAverages = function(newCommitMessage, classification) {
                if (classification == 'good') {
                    goodAverageValueHolder['total'] += 1;
                    goodAverageValueHolder['avgSentenceLength'] += newCommitMessage['sentenceLength'],
                    goodAverageValueHolder['avgLongestWord'] += newCommitMessage['longestWord'],
                    goodAverageValueHolder['avgWordLength'] += newCommitMessage['avgWordLength'],
                    goodAverageValueHolder['avgDiversity'] += newCommitMessage['diversity'],
                    goodAverageValueHolder['avgDensity'] += newCommitMessage['density'],
                    goodAverageValueHolder['avgNouns'] += newCommitMessage['nouns'],
                    goodAverageValueHolder['avgVerbs'] += newCommitMessage['verbs'],
                    goodAverageValueHolder['avgAdjectives'] += newCommitMessage['adjectives'],
                    goodAverageValueHolder['avgAdverbs'] += newCommitMessage['adverbs'],
                    goodAverageValueHolder['avgModals'] += newCommitMessage['modals']

                    $scope.goodOnes['avgSentenceLength'] = goodAverageValueHolder['avgSentenceLength']/goodAverageValueHolder['total'],
                    $scope.goodOnes['avgLongestWord'] = goodAverageValueHolder['avgLongestWord']/goodAverageValueHolder['total'],
                    $scope.goodOnes['avgWordLength'] = goodAverageValueHolder['avgWordLength']/goodAverageValueHolder['total'],
                    $scope.goodOnes['avgDiversity'] = goodAverageValueHolder['avgDiversity']/goodAverageValueHolder['total']
                    $scope.goodOnes['avgDensity'] = goodAverageValueHolder['avgDensity']/goodAverageValueHolder['total'],
                    $scope.goodOnes['avgNouns'] = goodAverageValueHolder['avgNouns']/goodAverageValueHolder['total'],
                    $scope.goodOnes['avgVerbs'] = goodAverageValueHolder['avgVerbs']/goodAverageValueHolder['total'],
                    $scope.goodOnes['avgAdjectives'] = goodAverageValueHolder['avgAdjectives']/goodAverageValueHolder['total'],
                    $scope.goodOnes['avgAdverbs'] = goodAverageValueHolder['avgAdverbs']/goodAverageValueHolder['total'],
                    $scope.goodOnes['avgModals'] = goodAverageValueHolder['avgModals']/goodAverageValueHolder['total']
                  } else {
                    badAverageValueHolder['total'] += 1;
                    badAverageValueHolder['avgSentenceLength'] += newCommitMessage['sentenceLength'],
                    badAverageValueHolder['avgLongestWord'] += newCommitMessage['longestWord'],
                    badAverageValueHolder['avgWordLength'] += newCommitMessage['avgWordLength'],
                    badAverageValueHolder['avgDiversity'] += newCommitMessage['diversity'],
                    badAverageValueHolder['avgDensity'] += newCommitMessage['density'],
                    badAverageValueHolder['avgNouns'] += newCommitMessage['nouns'],
                    badAverageValueHolder['avgVerbs'] += newCommitMessage['verbs'],
                    badAverageValueHolder['avgAdjectives'] += newCommitMessage['adjectives'],
                    badAverageValueHolder['avgAdverbs'] += newCommitMessage['adverbs'],
                    badAverageValueHolder['avgModals'] += newCommitMessage['modals']

                    $scope.badOnes['avgSentenceLength'] = badAverageValueHolder['avgSentenceLength']/badAverageValueHolder['total'],
                    $scope.badOnes['avgLongestWord'] = badAverageValueHolder['avgLongestWord']/badAverageValueHolder['total'],
                    $scope.badOnes['avgWordLength'] = badAverageValueHolder['avgWordLength']/badAverageValueHolder['total'],
                    $scope.badOnes['avgDiversity'] = badAverageValueHolder['avgDiversity']/badAverageValueHolder['total']
                    $scope.badOnes['avgDensity'] = badAverageValueHolder['avgDensity']/badAverageValueHolder['total'],
                    $scope.badOnes['avgNouns'] = badAverageValueHolder['avgNouns']/badAverageValueHolder['total'],
                    $scope.badOnes['avgVerbs'] = badAverageValueHolder['avgVerbs']/badAverageValueHolder['total'],
                    $scope.badOnes['avgAdjectives'] = badAverageValueHolder['avgAdjectives']/badAverageValueHolder['total'],
                    $scope.badOnes['avgAdverbs'] = badAverageValueHolder['avgAdverbs']/badAverageValueHolder['total'],
                    $scope.badOnes['avgModals'] = badAverageValueHolder['avgModals']/badAverageValueHolder['total']

                }
            }

            $timeout(getData,1000);

}]);

app.controller('ClassifyCtrl', ['$scope', '$location', '$http',
	function ($scope, $location, $http) {

            $scope.goToHome = function() {
                $location.path('/');
            }

            $scope.goToDemo = function() {
                $location.path('/demo');
            }

            $scope.goToClassify = function() {
                $location.path('/classify');
            }

            $scope.classify = function() {
                var url = '/classify';
                var commit = $scope.commitToClassify
                $http.post(url, commit)
                    .success(function(data, status) {
                    console.log('success');
                    $scope.classification = data;
                    })
                    .error(function(data, status) {
                    console.log('error');
                    });
            }

}]);
