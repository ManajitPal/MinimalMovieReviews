(function(){

var app = angular.module('starter', ['ionic','ionic.service.core','firebase','ngMaterial','ngAnimate','ngCordova'])


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

app.controller('mainController',function($scope,$firebaseArray, $cordovaSocialSharing){

  var ref = new Firebase('https://minimal-movie-reviews.firebaseio.com/');

   $scope.movieinfos = [];

   var fields = $firebaseArray(ref);


//reading data from the firebase database
  ref.on("child_added",function(snapshot,prevChildKey){

    fields = snapshot.val();

    $scope.movieinfos.push(fields);
    window.localStorage.setItem("moviecache", JSON.stringify(fields));

  },function(errorObject){

    console.log("The read failed:" + errorObject.code);
  })
  $scope.movieinfos.push(JSON.parse(window.localStorage.getItem("moviecache")));

//for opening youtube links
  $scope.traileropen = function(trailer){
    window.open(trailer,'_system','location=yes');return false;
  }
  $scope.click = false;
  $scope.clicked = function(){
    $scope.click = !$scope.click;
  }
  //social sharing using ng-cordova
  $scope.shareAnywhere = function(shareMovie) {
    $cordovaSocialSharing.share(JSON.stringify(shareMovie));
  }

})

  app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav) {
    $scope.toggleSidenav = function () {

      $mdSidenav('nav').toggle();
    };
    $scope.showMobileMainHeader = true;
    $scope.clearsearch= function () {
      $scope.movieinfos = null;
    }
    

  }]);

 app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('pink');
  })

}());
