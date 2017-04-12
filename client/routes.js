angular.module("casserole").run(function ($rootScope, $state, toastr) {
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    switch(error) {
      case "AUTH_REQUIRED":
        $state.go('anon.login');
        break;
      case "FORBIDDEN":
        //$state.go('root.home');
        break;
      case "UNAUTHORIZED":
      	toastr.error("Acceso Denegado");
				toastr.error("No tiene permiso para ver esta opción");
        break;
      default:
        $state.go('internal-client-error');
    }
  });
  $rootScope.$on('$stateChangeStart', function(next, current) { 
    NProgress.set(0.2);
  });
  $rootScope.$on('$stateChangeSuccess', function(next, current) { 
    NProgress.set(1.0);
  });
});

angular.module('casserole').config(['$injector', function ($injector) {
  var $stateProvider = $injector.get('$stateProvider');
  var $urlRouterProvider = $injector.get('$urlRouterProvider');
  var $locationProvider = $injector.get('$locationProvider');

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  /***************************
   * Anonymous Routes
   ***************************/
  $stateProvider
    .state('anon', {
      url: '',
      abstract: true,
      template: '<ui-view/>'
    })
    
    .state('anon.login', {
      url: '/login',
      templateUrl: 'client/login/login.ng.html',
      controller: 'LoginCtrl',
      controllerAs: 'lc'
    })
    .state('anon.logout', {
      url: '/logout',
      resolve: {
        'logout': ['$meteor', '$state', 'toastr', function ($meteor, $state, toastr) {
          return $meteor.logout().then(
            function () {
	            toastr.success("Vuelva pronto.");
              $state.go('anon.login');
            },
            function (error) {
              toastr.error(error.reason);
            }
          );
        }]
      }
    })
    .state('anon.comparar', {
      url: '/pagosImprimir/:pago/:alumno_id',
      templateUrl: 'client/pagos/pagosImprimir.ng.html',
      controller: 'PagosImprimirCtrl as pi',
     // params: { 'semanas': ':semanas' , 'id' : ':id'},
    });
  /***************************
   * Login Users Routes
   ***************************/
  $stateProvider
    .state('root', {
      url: '',
      abstract: true,
      templateUrl: 'client/layouts/root.ng.html',
      controller: 'RootCtrl as ro',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.home', {
      url: '/',
      templateUrl: 'client/home/home.ng.html',      
      controller: 'HomeCtrl as ho',
      resolve: {
				"currentUser": ["$meteor", "toastr", function($meteor, toastr){
					return $meteor.requireValidUser(function(user) {
						if(user.roles[0] == "admin" || user.roles[0] == "marca"){
							return true;
						}else{
							return 'UNAUTHORIZED'; 
						}					 	
         });
       }]
    	}
    })
    .state('root.marcas', {
      url: '/marcas',
      templateUrl: 'client/marcas/marcas.html',
      controller: 'MarcasCtrl as ma',
      resolve: {
        "currentUser": ["$meteor", "toastr", function($meteor, toastr){
          return $meteor.requireValidUser(function(user) {
            if(user.roles[0] == "marca" || user.roles[0] == "admin"){
              return true;
            }else{
              return 'UNAUTHORIZED'; 
            }           
         });
       }]
      }
    })
    .state('root.agencias', {
      url: '/agencias',
      templateUrl: 'client/agencias/agencias.html',
      controller: 'AgenciasCtrl as a',
      resolve: {
        "currentUser": ["$meteor", "toastr", function($meteor, toastr){
          return $meteor.requireValidUser(function(user) {
            if(user.roles[0] == "marca" || user.roles[0] == "admin"){
              return true;
            }else{
              return 'UNAUTHORIZED'; 
            }           
         });
       }]
      }
    })
    .state('root.modelosMarca', {
      url: '/modelos/:marca_id',
      templateUrl: 'client/modelos/modelos.html',
      controller: 'ModelosCtrl as m',
      resolve: {
        "currentUser": ["$meteor", "toastr", function($meteor, toastr){
          return $meteor.requireValidUser(function(user) {
            if(user.roles[0] == "marca" || user.roles[0] == "admin"){
              return true;
            }else{
              return 'UNAUTHORIZED'; 
            }           
         });
       }]
      }
    })
    .state('root.modelos', {
      url: '/modelos',
      templateUrl: 'client/modelos/modelos.html',
      controller: 'ModelosCtrl as m',
      resolve: {
        "currentUser": ["$meteor", "toastr", function($meteor, toastr){
          return $meteor.requireValidUser(function(user) {
            if(user.roles[0] == "marca" || user.roles[0] == "admin"){
              return true;
            }else{
              return 'UNAUTHORIZED'; 
            }           
         });
       }]
      }
    })
    .state('root.versiones', {
      url: '/versiones/:modelo_id/:marca_id',
      templateUrl: 'client/versiones/versiones.html',
      controller: 'VersionesCtrl as v',
      resolve: {
        "currentUser": ["$meteor", "toastr", function($meteor, toastr){
          return $meteor.requireValidUser(function(user) {
            if(user.roles[0] == "marca" || user.roles[0] == "admin"){
              return true;
            }else{
              return 'UNAUTHORIZED'; 
            }           
         });
       }]
      }
    })
    .state('anon.comparador', {
      url: '/comparador',
      templateUrl: 'client/comparador/comparador.html',
      controller: 'ComparadorCtrl as c',
/*
      resolve: {
        "currentUser": ["$meteor", "toastr", function($meteor, toastr){
          return $meteor.requireValidUser(function(user) {
            if(user.roles[0] == "gerente" || user.roles[0] == "admin"){
              return true;
            }else{
              return 'UNAUTHORIZED'; 
            }           
         });
       }]
      }
*/
    })
    .state('root.bitacora', {
      url: '/bitacora',
      templateUrl: 'client/bitacora/bitacora.html',
      controller: 'BitacoraCtrl as bita',
      resolve: {
        "currentUser": ["$meteor", "toastr", function($meteor, toastr){
          return $meteor.requireValidUser(function(user) {
            if(user.roles[0] == "gerente" || user.roles[0] == "admin"){
              return true;
            }else{
              return 'UNAUTHORIZED'; 
            }           
         });
       }]
      }
    })
    .state('root.dashboard', {
      url: '/leads',
      templateUrl: 'client/dashboard/dashboard.html',
      controller: 'DashboardCtrl as da',
      resolve: {
        "currentUser": ["$meteor", "toastr", function($meteor, toastr){
          return $meteor.requireValidUser(function(user) {
            if(user.roles[0] == "gerente" || user.roles[0] == "admin"){
              return true;
            }else{
              return 'UNAUTHORIZED'; 
            }           
         });
       }]
      }
    })
    .state('root.detalleCorreos', {
      url: '/detalleCorreos/:fechaInicio/:fechaFin',
      templateUrl: 'client/detalleCorreos/detalleCorreos.html',
      controller: 'DetalleCorreosCtrl as dc',
      resolve: {
        "currentUser": ["$meteor", "toastr", function($meteor, toastr){
          return $meteor.requireValidUser(function(user) {
            if(user.roles[0] == "gerente" || user.roles[0] == "admin"){
              return true;
            }else{
              return 'UNAUTHORIZED'; 
            }           
         });
       }]
      }
    })
    ;
}]);