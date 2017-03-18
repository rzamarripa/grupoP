angular.module('casserole',
  [
    'angular-meteor',    
    'ngAnimate',
    'ngCookies',
    'ngSanitize',    
    'toastr',
    'ui.router',
    'ui.grid',
    'smartadmin',
    'datePicker',
    'ui.calendar',
    'ui.bootstrap',
    'checklist-model',
    'ncy-angular-breadcrumb',
    'angularUtils.directives.dirPagination',
    'angular-meteor.auth',
  ]
)

/*
if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
}
else {
  angular.element(document).ready(onReady);
}
 
function onReady() {
  angular.bootstrap(document, ['casserole']);
}
*/
NProgress.configure({ easing: 'ease', speed: 600 });