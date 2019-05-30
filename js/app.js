var App = angular.module('AppConfigService', ['ui.router', 'oc.lazyLoad']);
App.provider('appConfig', ['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    this.module = function (modules) {
        $ocLazyLoadProvider.config({modules: modules});
    };
    this.otherwise = function (url) {
        $urlRouterProvider.otherwise(url);
        return this;
    };

    this.state = function (stateObj) {
        var deps = [];
        if (stateObj.deps) {
            deps = stateObj.deps.names;
            if (!deps)
                deps = [];

            if (stateObj.deps.files && stateObj.deps.files.length)
                deps.push(
                    {
                        name: 'BayerApp',
                        serie: true,
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: stateObj.deps.files
                    });
        }
        $stateProvider.state(stateObj.name, {
            url: stateObj.url,
            templateUrl: stateObj.templateUrl || 'views/' + stateObj.name + '.html',
            controller: stateObj.controller,
            resolve: {
                loadFiles: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(deps);
                }]
            }
        });
        return this;
    };
    this.$get = function () {
        return null;
    }
}]);

var AppConfig = angular.module('BayerApp', ['AppConfigService']);
AppConfig.config(['appConfigProvider', function (appConfigProvider) {
    appConfigProvider.module([]);
    appConfigProvider
        .otherwise('/single')
        .state({
            name: 'single',
            url: '/single',
            templateUrl: 'single.html',
            controller: "SingleController",
            deps: {
                names: [],
                files: [
                    '../js/singlecontroller.js'
                ]
            }
        })
}]);

App.controller("SingleController", function ($scope, $http) {
    $scope.controller = function () {
        alert('angular controller.');
    };
});
