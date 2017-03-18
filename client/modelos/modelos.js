angular.module("casserole")
.controller("ModelosCtrl", ModelosCtrl);  
 function ModelosCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
 	let rc = $reactive(this).attach($scope);
  
  this.action = true;
  this.nuevo = true;
  
  this.subscribe('modelos',()=>{
		return [{}]
	});
  
	this.subscribe('marcas',()=>{
		return [{estatus : true}]
	});

	this.helpers({
	  marcas : () => {
		  return Marcas.find();
	  },
	  modelos : () => {
		  var modelos = Modelos.find().fetch();
		  if(modelos){
			  _.each(modelos, function (modelo){
				  modelo.marca = Marcas.findOne(modelo.marca_id)
			  })
		  }
		  return modelos;
	  }
  });
  
  this.nuevoModelo = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.modelo = {};		
  };
  
  this.guardar = function(modelo,form)
	{
		if(form.$invalid){
      toastr.error('Error al guardar los datos.');
      return;
	  }
		modelo.estatus = true;
		modelo.usuarioInserto_id = Meteor.userId();
		Modelos.insert(modelo);
		toastr.success('Guardado correctamente.');
		this.modelo = {}; 
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};
	
	this.editar = function(id)
	{
    this.modelo = Modelos.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};
	
	this.actualizar = function(modelo,form)
	{
		if(form.$invalid){
      toastr.error('Error al actualizar los datos del Turno.');
      return;
	  }
		var idTemp = modelo._id;
		delete modelo._id;		
		modelo.usuarioActualizo_id = Meteor.userId(); 
		Modelos.update({_id:idTemp},{$set:modelo});
		toastr.success('Actualizado correctamente.');
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};

	this.cambiarEstatus = function(id)
	{
		var modelo = Modelos.findOne({_id:id});
		if(modelo.estatus == true)
			modelo.estatus = false;
		else
			modelo.estatus = true;
		
		Modelos.update({_id: id},{$set :  {estatus : modelo.estatus}});
  };
	
};
