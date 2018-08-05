(function(angular) {
    'use strict';

    var app = angular.module('peopleList', ['ngRoute']);


    //define main controller
    app.controller('PeopleMainController', function($scope, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;

    });
    // end of main controller

    // define the people service ------------------------------------------------------
    app.service('peopleResource', function($http) {
        var person;
        var favoriteList = [];
        this.getPeopleList = function() {
            return $http.get('https://randomuser.me/api?results=10');
        };

        this.setPerson = function(person) {
            this.person = person;
        }

        this.getPerson = function() {
            return this.person;
        }

        this.setFavorite = function(person, favoriteList)
        {
            var index = favoriteList.indexOf(person);
            if(person!=='' && index==-1) {
                favoriteList.push(person);
            }
            else{
                favoriteList = favoriteList;
            }
        }

        this.getFavorite = function() {
            return favoriteList;
        }
    });
    // end of define the people list service -------------------------------------------


     // define the Header Search input and log in user directive ---------------------
    function TopHeaderController($scope, peopleResource, $location) {
       var people = [];
       $scope.returnDefault = function (SearchString) {
            if(SearchString===''){

                peopleResource.getPeopleList().then(function(response){
                    people = response.data.results;
                    peopleResource.setPerson(people[0]);
                    $scope.person = people[0];
                    $location.path('/person/' + people[0].name.first);
                })
            }
        }
    }

    app.component('topHeader', {
        templateUrl: 'topHeader.html',
        controller: TopHeaderController
    });
    // end of define Header -----------------------------------------------------------


    // controller to show the people list -------------------------------------------------
    function PeopleListController($scope, $location, peopleResource, $window) {
        var vm = this;

        // get the people list from service
        peopleResource.getPeopleList().then(function(response) {
            console.log(response);
            vm.people = response.data.results;

        });

        $scope.getNextPeopleList = function() {
            peopleResource.getPeopleList().then(function(response){
                vm.people = response.data.results;

            })
        }

        // function to get the person detail ----------------------------------------------
        $scope.getPersonDetail = function(Person, Index) {
            if(Person !== undefined && Person !== null ) {

                    $scope.selectedPerson = Index;
                    peopleResource.setPerson(Person);
                    $scope.person = Person;
                console.log($scope.person);
                $window.sessionStorage.removeItem("clearSearch");
                $location.path('/person/' + Person.name.first);
            }
            else {
                alert('No person being selected');
            }
        };
        //end of get person detail -------------------------------------------------------
    }
    // end of people list controller

    //define the people list directive ---------------------------------------------------
    app.component('peopleList', {
        templateUrl: 'peopleList.html',
        controller: PeopleListController,
        controllerAs: 'vm'
    });
    // end of people list directive -----------------------------------------------------

   //define person detail controller -------------------------------------------------------------
    app.controller('PersonDetailController', function($scope, $routeParams, peopleResource) {
        $scope.name = 'PersonDetailController';
        $scope.params = $routeParams;
        $scope.person = peopleResource.getPerson();
        $scope.favoritePeople=peopleResource.getFavorite();
        console.log($scope.person);
        if($scope.person !== undefined && $scope.person !== null){
        }

        $scope.addToFavorite = function() {
          var favoritePeople= (peopleResource.getFavorite()==undefined)? [] : peopleResource.getFavorite();
        //  favoritePeople.push($scope.person);
          peopleResource.setFavorite($scope.person, favoritePeople);
          $scope.favoritePeople=peopleResource.getFavorite();
        }

        $scope.removeFromFavorite = function (person, favoriteList) {
            var index = favoriteList.indexOf(person);
            favoriteList.splice(index, 1);
            peopleResource.setFavorite('', favoriteList);
            $scope.favoritePeople=peopleResource.getFavorite();
            console.log(index);
        }

    });

    //route
    app.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/person/:person', {
                templateUrl: 'personDetail.html',
                controller: 'PersonDetailController',
                resolve: {

                    delay: function($q, $timeout) {
                        var delay = $q.defer();
                        $timeout(delay.resolve, 1000);
                        return delay.promise;
                    }
                }
            })

        $locationProvider.html5Mode(true);
    });

})(window.angular);

