'use strict';

/**
 * @ngdoc function
 * @name appviewproject0001App.controller:CtrlsCtrl
 * @description
 * # CtrlsCtrl
 * Controller of the appviewproject0001App
 */
angular.module('appviewproject0001App')
 .controller('CtrlsCtrl', 
[ '$rootScope', '$scope', '$http', '$location', '$log', '$state', '$stateParams', 'Notification', '$translate', '$injector',
function($rootScope, $scope, $http, $location, $log, $state, $stateParams, Notification, $translate, $injector)
{

        $scope.$on('findOneLoaded', function(event, data)
        {
                        event = null;
            data = null;
        });


    $scope.getCtrls = function(params, paramsObj) {

      var urlApi = $rootScope.api_url_base +'/ctrls?';

      if(typeof paramsObj.count !== 'undefined'){
          var skip = (paramsObj.count * (paramsObj.page - 1));
          urlApi += 'limit=' + paramsObj.count + '&skip=' + skip;
      }

      if(typeof paramsObj.sortBy !== 'undefined'){
        urlApi += '&sort=' + paramsObj.sortBy + ' ' + ((paramsObj.sortOrder === 'dsc') ? 'DESC' : 'ASC');
      }

      if(typeof paramsObj.filters !== 'undefined' && paramsObj.filters !== ''){
        urlApi += '&where={"name": {"contains":"' + paramsObj.filters + '"}}';
      }

      return $http.get(urlApi).then(function (r) {
          var data = {
              'rows': r.data.items,
              'header': [
                                        {name: $translate.instant('name')} ,
                                {Actions: $translate.instant('Actions')}
              ],
              'pagination': {
                  'count': r.data.items.length,
                  'page': paramsObj.page,
                  'pages': Math.ceil(r.data.info.total / paramsObj.count),
                  'size': r.data.info.total
              },
              'sortBy': paramsObj.sortBy,
              'sortOrder': paramsObj.sortOrder
          };
          return data;
      });
  };


    var Ctrls = $injector.get('Ctrls');

    $scope.ctrls = [];
    $scope.find = function()
    {
        return Ctrls.query(function(ctrls)
        {
            $scope.ctrls = ctrls;
            $scope.$emit('findLoaded', { data: ctrls });
            return $scope.ctrls;
        });
    };

    $scope.ctrl = {};
    $scope.findOne = function()
    {
        return Ctrls.get({
            ctrlId: $stateParams.ctrlId
        }, function(ctrl)
        {
            $scope.ctrl = ctrl;
            $scope.$emit('findOneLoaded', ctrl);
            return $scope.ctrl;
        });
    };



var Lovs = $injector.get('Lovs');
$scope.findLovs = function($typeSearch, $fieldLang, $type, $svar, $param) {
    var whereStmnt = {
        lovType: $type,
        status: 'active'
    };
    switch ($typeSearch) {
        case 'contains':
            if ($param !== '' && $fieldLang !== '') {
                whereStmnt[$fieldLang] = {
                    contains: $param
                };
            }
            break;
        default:
            if ($param !== '') {
                whereStmnt.name_ = $param;
            }
            break;
    }
    return Lovs.query({
        where: whereStmnt,
        sort: 'orderShow ASC'
    }, function(lovs) {
        $scope[$svar] = lovs.items;
        return $scope[$svar];
    });
};


    $scope.create = function(isValid)
    {
        if (isValid)
        {
            var ctrl = new Ctrls({

                                name: this.name,
                                                forctrl: 'ok'
            });

            ctrl.$save(function(response)
            {
            $location.path('ctrls/view/' + response.id);
                Notification.success({
                    title:'Ctrl',
                    message: 'Ctrl has been saved',
                    delay: 4000
                });
            });

        } else {
            $scope.submitted = true;
        }
    };

    $scope.update = function(isValid) {
      if (isValid) {
      var ctrl = $scope.ctrl;
                
        ctrl.$update(function() {
          $location.path('ctrls/view/' + ctrl.id);
          Notification.success({
                    title:'Ctrl',
                    message: 'Ctrl has been updated',
                    delay: 4000
                });
        });

      } else {
        $scope.submitted = true;
      }
    };


}]);