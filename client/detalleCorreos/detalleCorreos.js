angular
  .module('casserole')
  .controller('DetalleCorreosCtrl', DetalleCorreosCtrl);

function DetalleCorreosCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	let rc = $reactive(this).attach($scope);

	this.action = true;
	this.fechaInicio = new Date($stateParams.fechaInicio);
	this.fechaInicio.setHours(0,0,0,0);
	this.fechaFin = new Date($stateParams.fechaFin);
	this.fechaFin.setHours(23,59,59,0);
	window.rc = rc;

	this.subscribe('agencias',()=>{
		return [{estatus : true}]
	});

	this.subscribe('bitacoraCorreos', ()  => {
		return [{ fecha : { $gte : this.getReactively("fechaInicio"), $lt : this.getReactively("fechaFin") }}];
	});


	this.helpers({
			detalleCorreos : () => {
				return BitacoraCorreos.find();
			}
	})
}