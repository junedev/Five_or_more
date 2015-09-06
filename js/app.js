angular.module("fiveApp",["firebase","ngMockE2E"])
.constant("FIREBASE_URL","https://fiveormore.firebaseio.com/")
.directive('stopEvent', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.bind('click', function (e) {
          e.stopPropagation();
        });
      }
    };
 });