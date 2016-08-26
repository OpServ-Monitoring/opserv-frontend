/**
 * Created by Snare on 24.08.16.
 */


var app = angular.module('app',[
    'ngRoute',
    'gridster',
    'ngMaterial'
]);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('black', {
        '50': '242424',
        '100': '242424',
        '200': '242424',
        '300': '242424',
        '400': '242424',
        '500': '242424',
        '600': '242424',
        '700': '242424',
        '800': '242424',
        '900': '242424',
        'A100': '242424',
        'A200': '242424',
        'A400': '242424',
        'A700': '242424',
        'contrastDefaultColor': 'light'
    });
    $mdThemingProvider.definePalette('white', {
        '50': 'ffffff',
        '100': 'ffffff',
        '200': 'ffffff',
        '300': 'ffffff',
        '400': 'ffffff',
        '500': 'ffffff',
        '600': 'ffffff',
        '700': 'ffffff',
        '800': 'ffffff',
        '900': 'ffffff',
        'A100': 'ffffff',
        'A200': 'ffffff',
        'A400': 'ffffff',
        'A700': 'ffffff',
        'contrastDefaultColor': 'dark'
    });
    $mdThemingProvider.definePalette('blue', {
        '50': '00b8d4',
        '100': '00b8d4',
        '200': '00b8d4',
        '300': '00b8d4',
        '400': '00b8d4',
        '500': '00b8d4',
        '600': '00b8d4',
        '700': '00b8d4',
        '800': '00b8d4',
        '900': '00b8d4',
        'A100': '00b8d4',
        'A200': '00b8d4',
        'A400': '00b8d4',
        'A700': '00b8d4',
        'contrastDefaultColor': 'light'
    });

    $mdThemingProvider.theme('default')
        .primaryPalette('black')
        .backgroundPalette('white')
        .accentPalette('blue');
});

app.config(function ($routeProvider) {
    //TODO enable authentification
    $routeProvider.when("/",{
        templateUrl: "views/home.html",
        name: "Home",
        controller: 'Ctrl'
        //requiresLogin: true
    }).otherwise({
        redirectTo: "/"
    });
});