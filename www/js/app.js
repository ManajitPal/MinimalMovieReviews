(function(){

var app = angular.module('starter', ['ionic','ionic.service.core','firebase','ngMaterial','ngAnimate','ngCordova', 'LocalStorageModule'])


//There is an issue with the slider check the console and try to debug it.
// app.controller('slideCtrl',function($scope,$ionicSlides){
//   // $scope.$on("$ionicSlides.sliderInitialized",function(event,data){
//   //   $scope.slider = data.slider;
//   // });
//   //
//   // $scope.$on("$ionicSlides.slideChangeStart",function(event,data){
//   //   console.log('Slide change is beginning')
//   // });
//   //
//   // $scope.$on("$ionicSlides.slideChangeEnd",function(event,data){
//   //   $scope.activeIndex = data.activeIndex;
//   //   $scope.previousIndex = data.previousIndex;
//   // });
// })

  app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('todo');
  });

  app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'pages/home.html'
      })
      .state('bookmarks', {
        url: '/bookmarks',
        templateUrl: 'pages/bookmarks.html'
      });

    $urlRouterProvider.otherwise("/home");

  });
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    var push = new Ionic.Push({
      "debug": true
    });

    push.register(function(token) {
      console.log("Device token:",token.token);
      push.saveToken(token);
    });

    if(window.cordova && window.cordova.plugins.Keyboard) {

      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.controller('mainController',function($scope,$firebaseArray, $cordovaSocialSharing, localStorageService){

  var ref = new Firebase('https://minimal-movie-reviews.firebaseio.com/');

   $scope.movieinfos = [];
  $scope.bookmarks = [];



   var fields = $firebaseArray(ref);


//reading data from the firebase database
  ref.on("child_added",function(snapshot,prevChildKey){

    fields = snapshot.val();
          $scope.movieinfos.push(fields);

  },function(errorObject){

    console.log("The read failed:" + errorObject.code);
  })



//for opening youtube links
  $scope.traileropen = function(trailer){
    window.open(trailer,'_system','location=yes');return false;
  }

  //social sharing using ng-cordova
  $scope.shareAnywhere = function(shareMovie) {
    $cordovaSocialSharing.share(JSON.stringify(shareMovie));
  }

  //adding bookmark
  $scope.addBookmark = function (addMovie) {
    $scope.bookmarks.push(addMovie);
    localStorageService.set("bookmarkedItem", $scope.bookmarks);

  }
  //deleting bookmark
  $scope.deleteBookmark = function (id) {
    var bookmark = $scope.bookmarks[id];
    $scope.bookmarks.splice(id, 1);
    localStorageService.set("bookmarkedItem", $scope.bookmarks);
    $scope.bookmarks = localStorageService.get("bookmarkedItem");

  }


  //Retrieving bookmarks

  $scope.getBookmark = function () {

    if (localStorageService.get("bookmarkedItem")) {
      $scope.bookmarks = localStorageService.get("bookmarkedItem");
    } else {
      $scope.bookmarks = [];
    }
  }

  
  $scope.bookmarks = localStorageService.get("bookmarkedItem");

})

  app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav) {
    $scope.toggleSidenav = function () {

      $mdSidenav('nav').toggle();

    };

    $scope.showMobileMainHeader = true;



  }]);

 app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('pink');
  })

}());
