(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(FlashService, UserService, $scope) {
        var vm = this;

        vm.user = null;
        $scope.searchedValues = [];

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;

                if (angular.isDefined(user.searchHistory)){
                    $scope.searchedValues = vm.user.searchHistory;
                }
                else {
                    $scope.searchedValues = [];
                }
            });
        }

        $scope.lat = undefined;
        $scope.lng = undefined;
        $scope.$on('gmPlacesAutocomplete::placeChanged', function () {
            var location = $scope.autocomplete.getPlace().geometry.location;

            $scope.lat = location.lat();
            $scope.lng = location.lng();
            $scope.address = $scope.autocomplete.getPlace().formatted_address;
            $scope.placeID = $scope.autocomplete.getPlace().place_id;
            

            // console.log($scope.autocomplete.getPlace());
            var obj = {
                Latitude: $scope.lat,
                Longitude: $scope.lng,
                Address: $scope.address,
                GooglePlaceID: $scope.placeID
            }
            $scope.searchedValues.push(obj);

            vm.user.searchHistory = $scope.searchedValues;
            $scope.$apply();

            UserService.UpdateSearchHistory(vm.user)
            
                .then(function () {
                    FlashService.Success('Search Table updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });

        });
    }

})();