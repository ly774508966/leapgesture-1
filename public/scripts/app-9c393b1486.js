!function(){"use strict";angular.module("leapgesture",["ngCookies","ngTouch","ngSanitize","ngMessages","ngAnimate","ngAria","ngResource","ui.router","ui.bootstrap","toastr","ui-rangeSlider"])}(),function(){"use strict";function e(e,n){return{restrict:"AE",replace:!0,templateUrl:"app/components/playControls/playControls.html",link:function(e,a,r){var t=angular.element(a.find(".playhead")[0]),l={};n.controller.on("frame",function(){if(n.player&&"playing"===n.player.state)if(e.main.player&&e.main.player.recording){var a=e.main.player.recording.frameIndex/(e.main.player.recording.frameCount-1)*100+"%";t.css({width:a})}else t.css({width:"0%"})}),e.$on("$destroy",function(){angular.forEach(l,function(e){e()})})}}}e.$inject=["$log","leapController"],angular.module("leapgesture").directive("playControls",e)}(),function(){"use strict";function e(){var e=new Leap.Controller({background:!0}).use("playback",{loop:!1,pauseHotkey:!1,pauseOnHand:!1,autoPlay:!1}).use("riggedHand").connect(),n=e.plugins.playback.player;this.$get=function(){return{controller:e,player:n}}}angular.module("leapgesture").provider("leapController",e)}(),function(){"use strict";function e(e,n){e.gestureName="My Gesture",e.save=function(){e.$close(e.gestureName)},e.cancel=function(){e.$dismiss("Dismissed")}}e.$inject=["$scope","$uibModalInstance"],angular.module("leapgesture").controller("SaveRecordingModalController",e)}(),function(){"use strict";function e(e,n,a,r,t){var l=this;l.view={loading:!1,currentGestureId:null,recordedGesture:{name:"My Gesture"},playing:!1,recording:!1,unsavedRecording:!1};var i=a("/api/gestures/:id",{id:"@id"},{create:{method:"POST"},index:{method:"GET",isArray:!1},show:{method:"GET",isArray:!1},update:{method:"PUT"},destroy:{method:"DELETE"}});l.gestures=[],l.player=n.player,n.controller.on("playback.recordingFinished",function(){l.view.recording=!1;var e=r.open({animation:!0,templateUrl:"app/main/saveRecordingModal.html",controller:"SaveRecordingModalController",controllerAs:"modal",size:"lg"});e.result.then(function(e){l.view.recordedGesture.name=e,l.save()})}),n.controller.on("playback.playbackFinished",function(){l.view.playing=!1,e.$apply()}),l.toggle=function(){l.view.playing=!l.view.playing,l.player.toggle()},l.play=function(){l.view.playing=!0,n.player.play()},l.pause=function(){l.view.playing=!1,n.player.pause()},l.clear=function(){n.player.stop(),l.view.playing=!1},l.selectGesture=function(e){return e===l.view.currentGestureId?(l.view.currentGestureId=null,l.player.playing&&l.player.stop(),l.view.playing=!1,void l.clear()):(l.view.unsavedRecording=!1,l.view.loading=!0,void i.show({id:e},function(e){n.player.setRecording({compressedRecording:e.data.data}),l.view.currentGestureId=e.data.id,l.view.loading=!1,l.play()}))},l.record=function(){return l.view.recording?(l.view.recording=!1,l.player.pause(),l.player.stop(),void l.player.clear()):(l.view.currentGestureId=null,l.view.recording=!0,void n.player.record())},l["delete"]=function(){l.view.loading=!0,i.destroy({id:l.view.currentGestureId},function(){l.view.loading=!1,o()})},l.save=function(){var e=n.player.recording["export"]("lz"),a=new i({data:e,name:l.view.recordedGesture.name});a.$save().then(function(){l.view.unsavedRecording=!1,o()})};var o=function(){l.view.loading=!0,i.index(function(e){l.gestures=e.data,l.view.loading=!1})};o()}e.$inject=["$scope","leapController","$resource","$uibModal","$log"],angular.module("leapgesture").controller("MainController",e)}(),function(){"use strict";function e(e){e.debug("runBlock end")}e.$inject=["$log"],angular.module("leapgesture").run(e)}(),function(){"use strict";function e(e,n){e.state("home",{url:"/",templateUrl:"app/main/main.html",controller:"MainController",controllerAs:"main"}),n.otherwise("/")}e.$inject=["$stateProvider","$urlRouterProvider"],angular.module("leapgesture").config(e)}(),function(){"use strict";angular.module("leapgesture")}(),function(){"use strict";function e(e,n){e.debugEnabled(!0),n.allowHtml=!0,n.timeOut=3e3,n.positionClass="toast-top-right",n.preventDuplicates=!0,n.progressBar=!0}e.$inject=["$logProvider","toastrConfig"],angular.module("leapgesture").config(e)}(),angular.module("leapgesture").run(["$templateCache",function(e){e.put("app/main/main.html",'<div class="container-fluid">\n  <div class="loading" ng-show="main.view.loading"><span class="loading-spin"></span></div>\n  <div class="row">\n    <div class="controls col-xs-3">\n      <h1>LeapGesture</h1>\n      <p>This app requires a Leap Motion controller connected to your computer. Record hand gestures, save them, and play them back. To record a new gesture:</p>\n      <ul>\n        <li>Click <span class="record">Record</span></li>\n        <li>Put your hand over the the Leap Motion controller</li>\n        <li>The recording will stop when you move your hands away</li>\n        <li>You will be prompted to save your gesture</li>\n      </ul>\n      <h4 class="gestures-header">Gestures</h4>\n      <ul class="gestures">\n          <li ng-repeat="gesture in main.gestures" ng-class="{ selected : gesture.id === main.view.currentGestureId }"><span ng-click="main.selectGesture(gesture.id)">{{gesture.name}}</span></li>\n      </ul>\n      <div class="row">\n        <div class="col-xs-12">\n          <button class="btn" ng-click="main.record()" ng-class="{ \'btn-danger\' : main.view.recording, \'btn-default\' : !main.view.recording }"><span class="glyphicon glyphicon-record"></span> Record</button>\n          <button class="btn btn-default play-pause" ng-disabled="!main.player.recording || !main.view.currentGestureId" ng-click="main.toggle()">\n            <span ng-show="!main.view.playing"><span class="glyphicon glyphicon-play"></span> Play</span>\n            <span ng-show="main.view.playing"><span class="glyphicon glyphicon-pause"></span> Pause</span>\n          </button>\n         <!-- <button class="btn btn-default play-pause" ng-show="main.view.playing" ng-disabled="!main.player.recording || !main.view.currentGestureId" ng-click="main.pause()"><span class="glyphicon glyphicon-pause"></span> Pause</button> -->\n          <button class="btn btn-default" ng-disabled="!main.player.recording || !main.view.currentGestureId" ng-click="main.delete()"><span class="glyphicon glyphicon-trash"></span> Delete</button>\n        </div>\n      </div>\n    </div>\n    <div class="player-controller-container col-xs-9">\n      <play-controls></play-controls>\n    </div>\n  </div>\n</div>\n'),e.put("app/main/saveRecordingModal.html",'<div class="modal-header">\n    <h3 class="modal-title">Save Gesture</h3>\n</div>\n<div class="modal-body">\n  <form>\n    <div class="form-group">\n      <input type="text" class="form-control" placeholder="Gesture name" ng-model="gestureName">\n    </div>\n  </form>\n</div>\n<div class="modal-footer">\n    <button class="btn btn-primary" type="button" ng-click="save()">Save</button>\n    <button class="btn btn-default" type="button" ng-click="cancel()">Discard</button>\n</div>\n'),e.put("app/components/playControls/playControls.html",'<div class="player-controller">\n  <div class="playhead"></div>\n  <div class="full-recording"></div>\n</div>\n')}]);
//# sourceMappingURL=../maps/scripts/app-9c393b1486.js.map