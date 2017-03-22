angular.module('uszapp.pointstest')
.controller('PointsTestCtrl', function($scope, $state) {

    this.goToFirstRound = function() {
        $state.go('pointstest.round');
    };

});
