angular.module("casserole")
.controller("MarcasCtrl", MarcasCtrl);  
 function MarcasCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
 	let rc = $reactive(this).attach($scope);
  
  this.action = true;
  this.nuevo = true;
  window.rc = rc;
  
	this.subscribe('marcas',()=>{
		return [{}]
	 });

	this.helpers({
	  marcas : () => {
		  return Marcas.find();
	  }
  });
  
  this.nuevaMarca = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.marca = {};		
    this.marca.imagen = "";
  };
  
  
  
  
  this.guardar = function(marca,form)
	{
		if(form.$invalid){
      toastr.error('Error al guardar los datos.');
      return;
	  }
	  
		marca.estatus = true;
		marca.usuarioInserto_id = Meteor.userId();
		
		Marcas.insert(marca);
		
		toastr.success('Guardado correctamente.');
		this.marca = {}; 
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};
	
	this.editar = function(id)
	{
    this.marca = Marcas.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};
	
	this.actualizar = function(marca,form)
	{
		if(form.$invalid){
      toastr.error('Error al actualizar los datos del Turno.');
      return;
	  }
		var idTemp = marca._id;
		delete marca._id;		
		marca.usuarioActualizo_id = Meteor.userId(); 
		Marcas.update({_id:idTemp},{$set:marca});
		toastr.success('Actualizado correctamente.');
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};

	this.cambiarEstatus = function(id)
	{
		var marca = Marcas.findOne({_id:id});
		if(marca.estatus == true)
			marca.estatus = false;
		else
			marca.estatus = true;
		
		Marcas.update({_id: id},{$set :  {estatus : marca.estatus}});
  };
	
};
