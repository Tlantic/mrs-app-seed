// Ionic Starter App

(function app(angular, cordova) {
  'use strict';
  
  angular.module('App', ['ionic', 'MRS.App.Core', 'MRS.App.i18n']);
  
  angular.module('App').config(['$appConfig', '$stateProvider', '$urlRouterProvider', '$compileProvider', myAppConfig]);
  angular.module('App').run(['$window', '$appConfig', '$ionicPlatform', 'i18nTranslate', myAppRun]);
  
  function myAppConfig($config, $stateProvider, $urlRouterProvider, $compileProvider) {
    
    // Set routes
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        controller: 'AppController',
        template: '<ion-nav-view></ion-nav-view>',
        resolve: {
           i18nLoad: ['$q', 'i18nTranslate', function ($q, $i18n) {
              var deferred = $q.defer();
              $i18n.setDefaultLanguage($config.language, deferred.resolve);
              return deferred.promise;
          }]
        }
      })
      .state('app.home', {
        url: '/home',
        controller: 'HomeController',
        templateUrl: 'templates/home.html'
      });
    
    // Set default route
    $urlRouterProvider.otherwise('/app/home');
    
    // Configure href policy
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript|geo|maps):/);
  }
  
  function myAppRun(window, $config, $ionicPlatform, $i18n) {
    // Wait for IonicApp is ready
    $ionicPlatform.ready(onIonicAppReady);
   
    function onIonicAppReady() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        window.StatusBar.styleLightContent();
      }
      
      // Setup language
      // this is done in the first route to make sure that is loaded before any action
    }
  }
  
}(window.angular, window.cordova));