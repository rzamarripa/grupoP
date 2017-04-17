angular.module("casserole")
.controller("TiposVehiculosCtrl", TiposVehiculosCtrl);  
 function TiposVehiculosCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
 	let rc = $reactive(this).attach($scope);
 	
 	this.subscribe("tiposVehiculos", () => {
	 	return [{}]
 	});
 	
 	this.helpers({
	 	tiposVehiculos : () => {
		 	return TiposVehiculos.find();
	 	}
 	});
  
  this.action = true;
  this.nuevo = true;
  this.tiposVehiculos = [];
  this.tipoVehiculo = {};
  window.rc = rc;
  
	this.subscribe('tipoVehiculos',()=>{
		return [{}]
	});
  
  this.nuevoTipoVehiculo = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.tipoVehiculo = {};		
  };
  
  this.guardar = function(tipoVehiculo,form)
	{
		if(form.$invalid){
      toastr.error('Error al guardar los datos.');
      return;
	  }
		tipoVehiculo.estatus = true;
		
		tipoVehiculo.usuarioInserto_id = Meteor.userId();
		console.log(tipoVehiculo);

		TiposVehiculos.insert(tipoVehiculo);
		
		toastr.success('Guardado correctamente.');
		this.tipoVehiculo = {}; 
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};
	
	this.editar = function(id)
	{
    this.tipoVehiculo = TiposVehiculos.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};
	
	this.actualizar = function(tipoVehiculo,form)
	{
		if(form.$invalid){
      toastr.error('Error al actualizar los datos de la tipoVehiculo.');
      return;
	  }
		var idTemp = tipoVehiculo._id;
		delete tipoVehiculo._id;		
		tipoVehiculo.usuarioActualizo_id = Meteor.userId(); 
		TiposVehiculos.update({_id:idTemp},{$set:tipoVehiculo});
		
		toastr.success('Actualizado correctamente.');
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};
	
	this.cambiarEstatus = function(id)
	{
		var tipoVehiculo = TiposVehiculos.findOne({_id:id});
		if(tipoVehiculo.estatus == true)
			tipoVehiculo.estatus = false;
		else
			tipoVehiculo.estatus = true;
		
		TiposVehiculos.update({_id: id},{$set :  {estatus : tipoVehiculo.estatus}});
  };
  
};
