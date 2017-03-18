angular.module("casserole")
.controller("ComparadorCtrl", ComparadorCtrl);  
 function ComparadorCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
 	let rc = $reactive(this).attach($scope);
  
  this.action = true;
  this.nuevo = true;
  this.marca1_id = "";
  this.modelo1_id = "";
  this.version1_id = "";
  
  this.subscribe('marcas',()=>{
		return [{estatus : true, _id : $stateParams.marca_id}]
	});
  
  this.subscribe('modelos',()=>{
		return [{estatus : true, _id : $stateParams.modelo_id}]
	});
  
	this.subscribe('versiones',()=>{
		return [{}]
	});
	
	this.version = {}; 

	this.helpers({
	  marcas : () => {
		  return Marcas.find();
	  },
	  modelo : () => {
		  return Modelos.findOne($stateParams.modelo_id);
	  },
	  versiones : () => {
		  var versiones = Versiones.find().fetch();
		  if(versiones){
			  _.each(versiones, function (version){
				  version.marca = Marcas.findOne(version.marca_id)
				  version.version = Versiones.findOne(version.marca_id)
			  })
		  }
		  return versiones;
	  }
  });
  
  this.nuevaVersion = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.version = {};		
  };
  
  this.guardar = function(version,form)
	{
		if(form.$invalid){
      toastr.error('Error al guardar los datos.');
      return;
	  }
		version.estatus = true;
		version.marca_id = $stateParams.marca_id;
		version.modelo_id = $stateParams.modelo_id;
		version.usuarioInserto_id = Meteor.userId();
		Versiones.insert(version);
		toastr.success('Guardado correctamente.');
		this.version = {}; 
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};
	
	this.editar = function(id)
	{
    this.version = Versiones.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};
	
	this.actualizar = function(version,form)
	{
		if(form.$invalid){
      toastr.error('Error al actualizar los datos del Turno.');
      return;
	  }
		var idTemp = version._id;
		delete version._id;		
		version.usuarioActualizo_id = Meteor.userId(); 
		Versiones.update({_id:idTemp},{$set:version});
		toastr.success('Actualizado correctamente.');
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};

	this.cambiarEstatus = function(id)
	{
		var version = Versiones.findOne({_id:id});
		if(version.estatus == true)
			version.estatus = false;
		else
			version.estatus = true;
		
		Versiones.update({_id: id},{$set :  {estatus : version.estatus}});
  };
  
  
  this.getMarcas= function(marca_id)
		{
		
	
			console.log(marca_id);
			rc.marcas = Marcas.findOne(marca_id);
		};
	
};
