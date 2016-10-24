import * as angular from "angular";
import "angular-ui-router";
import Dashboard from "./dashboard"

Dashboard();

angular
    .module("NgDemoApp", ['ui.router', 'DashboardModule'])
    .run(function NgDemoAppRun($rootScope: ng.IScope, $state: ng.ui.IStateService){
        $state.go("home");
    })
    .config(function NgDemoAppConfig($stateProvider: ng.ui.IStateProvider) {

    })
;