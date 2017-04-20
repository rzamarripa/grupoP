angular.module("casserole")
.controller("PrincipalCtrl", PrincipalCtrl);
 function PrincipalCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
 	let rc = $reactive(this).attach($scope);
  this.seleccion = {};
  this.modelos = [];
  this.versiones = [];
	this.numero = 0;
	window.rc = rc;
  
  this.subscribe('marcas',()=>{
		return [{estatus : true}]
	});
	
	this.subscribe('agencias',()=>{
		return [{estatus : true}]
	});
	
  this.subscribe('modelos', ()=>{
		return [{}]
	},{
		onReady : this.marcaActualizar
	});
  
	this.subscribe('versiones',()=>{
		return [{estatus : true}]
	},{
		onReady : this.modeloActualizar
	});
	
	this.helpers({
	  marcas : () => {
		  return Marcas.find();
	  }
  });
  
  this.getModelos = function(marca_id){
	  rc.modelos = Modelos.find({marca_id : marca_id}).fetch();
  }
  
  this.filtrar = function(modelo_id){
	 rc.versiones = Versiones.find({modelo_id : modelo_id}).fetch();
	 _.each(rc.versiones, function(version){
		 version.modelo = Modelos.findOne(version.modelo_id);
	 })
  }
  
  this.comparar = function(){
	  this.comparando = true;
  }
  
  this.mostrarCiudades = function(indice, version){
	  rc.versionAContactar = Versiones.findOne(rc.idsSeleccionadas[indice]);
	  rc.modeloAContactar = Modelos.findOne(rc.versionAContactar.modelo_id);
	  var agencias = Agencias.find({marca_id : rc.versionAContactar.marca_id}).fetch();
	  rc.ciudades = [];
	  _.each(agencias, function(agencia){
		  rc.ciudades.push({
			  nombre : agencia.ciudad,
			  agencia_id : agencia._id
		  })
	  });
  }
  
  this.enviarEmail = function(formModal, correo){
	  
	  if(formModal.$invalid){
      toastr.error('Los campos rojos no pueden ir vacíos y debe ser un correo válido.');
      return;
	  }else{
			$('#formModal')[0].reset();
	  }
	  NProgress.start()
	  var agencia = Agencias.findOne(correo.agencia_id);
	  var marca = Marcas.findOne(agencia.marca_id);
	  var modelo = Modelos.findOne(rc.versionAContactar.modelo_id);
	  if(correo.comentario == undefined)
	  	correo.comentario = "No dejó comentario";
	  var comentario = 	correo.comentario + "<br/><br/>" +
	  									"<strong>Marca:</strong> " + marca.nombre + "<br/>" +
	  									"<strong>Modelo:</strong> " + modelo.nombre + "<br/>" +
	  									"<strong>Versión:</strong> " + rc.versionAContactar.nombre + "<br/><br/>" +
	  									"<strong>" + correo.nombre + "</strong><br/>" +
	  									"<strong>Teléfono:</strong> " + correo.telefono + "<br/>" +
	  									"<strong>Correo:</strong> " + correo.correo + "<br/>";
	  var de = "Clientes <" + correo.correo + ">";
	  $('#myModal').modal('hide')
	  Meteor.apply("sendEmail",
	  	[agencia.correo, 
	  	de,
	  	marca.nombre + "-" + modelo.nombre + "-" + rc.versionAContactar.nombre, 
	  	comentario], function(error, result){
		  	NProgress.set(0.4) 
		  	if(result){
			  	NProgress.done();
			  	BitacoraCorreos.insert({
				  	nombre : correo.nombre, 
				  	telefono : correo.telefono, 
				  	correo : correo.correo, 
				  	marca : marca.nombre, 
				  	marca_id : marca._id,
				  	agencia : agencia.nombre,
				  	agencia_id : agencia._id,
				  	modelo : modelo.nombre,
				  	modelo_id : modelo._id,
				  	version : rc.versionAContactar.nombre,
				  	version_id : rc.versionAContactar._id,
				  	fecha : new Date(),
				  	semana : moment().isoWeek(),
				  	mes : moment().month() + 1,
				  	dia : moment().date(),
				  	anio : moment().year(),
				  	diaSemana :moment().isoWeekday()});
			  	toastr.success("Gracias por contactarnos, nosotros nos pondremos en contacto lo antes posible.") 
				}
	  	});
	  	rc.correo = {};
  }
};
