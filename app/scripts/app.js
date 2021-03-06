'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('IonicFirebaseTodoApp', ['ionic', 'firebase']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    controller: 'ContentController',
    templateUrl: 'templates/applayout.html'
  })

  .state('app.tasks', {
    url: '/tasks',
    views: {
      'menuContent' :{
        templateUrl: 'templates/centercontent.html'
      }
    }
  });

  $urlRouterProvider.otherwise('/app/tasks');
});
