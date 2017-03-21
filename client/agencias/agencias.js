angular.module("casserole")
.controller("AgenciasCtrl", AgenciasCtrl);  
 function AgenciasCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
 	let rc = $reactive(this).attach($scope);
  
  this.action = true;
  this.nuevo = true;
  
	this.subscribe('agencias',()=>{
		return [{}]
	 });
	 
	this.subscribe('marcas',()=>{
		return [{estatus : true}]
	 });

	this.helpers({
		agencias : () => {
			var agencias = Agencias.find().fetch();
			if(agencias){
				_.each(agencias, function(agencia){
					agencia.marca = Marcas.findOne(agencia.marca_id);
				})
			}
			return agencias;
		},
	  marcas : () => {
		  return Marcas.find();
	  }
  });
  
  this.nuevaAgencia = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.agencia = {};		
  };
  
  this.guardar = function(agencia,form)
	{
		if(form.$invalid){
      toastr.error('Error al guardar los datos.');
      return;
	  }
		agencia.estatus = true;
		agencia.usuarioInserto_id = Meteor.userId();
		Agencias.insert(agencia);
		toastr.success('Guardado correctamente.');
		this.agencia = {}; 
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};
	
	this.editar = function(id)
	{
    this.agencia = Agencias.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};
	
	this.actualizar = function(agencia,form)
	{
		if(form.$invalid){
      toastr.error('Error al actualizar los datos del Turno.');
      return;
	  }
		var idTemp = agencia._id;
		delete agencia._id;		
		agencia.usuarioActualizo_id = Meteor.userId(); 
		Agencias.update({_id:idTemp},{$set:agencia});
		toastr.success('Actualizado correctamente.');
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};

	this.cambiarEstatus = function(id)
	{
		var agencia = Agencias.findOne({_id:id});
		if(agencia.estatus == true)
			agencia.estatus = false;
		else
			agencia.estatus = true;
		
		Agencias.update({_id: id},{$set :  {estatus : agencia.estatus}});
  };
	
};