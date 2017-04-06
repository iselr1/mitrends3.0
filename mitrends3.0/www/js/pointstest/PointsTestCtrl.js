angular.module('uszapp.pointstest')
.controller('PointsTestCtrl', function($scope, $state, $rootScope, $ionicHistory) {

    this.goToFirstRound = function() {
        $ionicHistory.clearHistory();
        $state.go('PointstestRound');
    };
    
    
      this.goLeftHand = function() {
        $ionicHistory.clearHistory();
        $state.go('leftHandPointTest');
    };
    
     this.goRightHand = function() {
       $ionicHistory.clearHistory();
        $state.go('rightHandPointTest');
    };
    
    

});
