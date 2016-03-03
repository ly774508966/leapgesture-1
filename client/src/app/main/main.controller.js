(function() {
  'use strict';

  angular
    .module('leapgesture')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, leapController, $resource, $log, $http) {

    //var player = leapController.controller.plugins.playback.player;

    var Gesture = $resource("/api/gestures/:id", { id: "@id" },
      {
        'create':  { method: 'POST' },
        'index':   { method: 'GET', isArray: false },
        'show':    { method: 'GET', isArray: false },
        'update':  { method: 'PUT' },
        'destroy': { method: 'DELETE' }
      }
    );

    $scope.gestures = [];

    $scope.player = leapController.player;

    $scope.play = function(id) {
      // get the recording from the server
      Gesture.show({id : id}, function(response){
        leapController.player.setRecording({'compressedRecording' : response.data.data});
        leapController.player.play();
      });
    };

    $scope.record = function() {
      leapController.player.record();
    };

    $scope.save = function() {
      var gesture = leapController.player.recording.export('lz');
      //var gesture = "N4IgtgpgLghgJjWIBcoBmB7ATmRA1CLAZwEsMA7FAJgBoQBzCcwx";
      var newGesture = new Gesture({'data': gesture});
      newGesture.$save().then(function(response){
        $log.log("save response: ", response);
      });
    };

    // We can retrieve a collection from the server

    Gesture.index(function(response) {
      $scope.gestures = response.data;
    });

    /*
    $http.get("/api/gestures/20").then(function(response){
      console.log(response);
    }, function(error){
      console.error(error);
    });
    */

  }

})();
