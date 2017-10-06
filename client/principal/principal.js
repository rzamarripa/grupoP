angular.module("casserole")
.controller("PrincipalCtrl", PrincipalCtrl);
 function PrincipalCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
 	let rc = $reactive(this).attach($scope);
  this.seleccion = {};
  this.modelos = [];
  this.versiones = [];
	this.numero = 0;
	this.versionAContactar = {};
	this.modeloAContactar = {};
	this.marcaAContactar = {};
	this.agenciaSeleccionada = {};
	this.ciudades = [];

  this.subscribe('marcas',()=>{
		return [{estatus : true}]
	});

	this.subscribe('agencias',()=>{
		return [{estatus : true}]
	});

	this.subscribe('tiposVehiculos',()=>{
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

	this.subscribe('estados',()=>{
		return [{}]
	});

	this.subscribe('ciudades',()=>{
		return [{}]
	});

	this.helpers({
	  marcas : () => {
		  return Marcas.find();
	  },
	  tiposVehiculos : () =>{
		  return TiposVehiculos.find();
	  },
	  estados : () => {
		  return Estados.find();
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

  this.enviarEmail = function(formModal, correo){

	  if(formModal.$invalid){
      toastr.error('Los campos rojos no pueden ir vacíos y debe ser un correo válido.');
      return;
	  }else{
			$('#formModal')[0].reset();
	  }
	  NProgress.start()
	  var agencias = Agencias.find({marca_id : rc.marcaAContactar._id}).fetch();
	  var correoAgencia = "";
	  var existe = false;
	  _.each(agencias, function(agencia){
		  if(agencia.ciudad_id == correo.ciudad_id){
			  existe = true;
			  rc.agenciaSeleccionada = agencia;
		  }
	  })

	  if(existe){
		  rc.agenciaAContactar = Agencias.findOne(rc.agenciaSeleccionada._id);
	  }else{
		  rc.agenciaAContactar = Agencias.findOne({marca_id : rc.marcaAContactar._id, default : true});
	  }

	  if(correo.comentario == undefined)
	  	correo.comentario = "No dejó comentario";
	  var comentario = 	correo.comentario + "<br/><br/>" +
	  									"<strong>Marca:</strong> " + rc.marcaAContactar.nombre + "<br/>" +
	  									"<strong>Modelo:</strong> " + rc.modeloAContactar.nombre + "<br/>" +
	  									"<strong>Versión:</strong> " + rc.versionAContactar.nombre + "<br/><br/>" +
	  									"<strong>" + correo.nombre + "</strong><br/>" +
	  									"<strong>Teléfono:</strong> " + correo.telefono + "<br/>" +
	  									"<strong>Correo:</strong> " + correo.correo + "<br/>";
	  var de = "Clientes <" + correo.correo + ">";

	  $('#myModal').modal('hide')

	  Meteor.apply("sendEmail",
	  	[rc.agenciaAContactar.correo,
	  	de,
	  	rc.marcaAContactar.nombre + "-" + rc.modeloAContactar.nombre + "-" + rc.versionAContactar.nombre, comentario], function(error, result){
		  	NProgress.set(0.4)
		  	if(result){
			  	NProgress.done();
			  	BitacoraCorreos.insert({
				  	nombre : correo.nombre,
				  	telefono : correo.telefono,
				  	correo : correo.correo,
				  	marca : rc.marcaAContactar.nombre,
				  	marca_id : rc.marcaAContactar._id,
				  	agencia : rc.agenciaAContactar.nombre,
				  	agencia_id : rc.agenciaAContactar._id,
				  	modelo : rc.modeloAContactar.nombre,
				  	modelo_id : rc.modeloAContactar._id,
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

  this.buscarTipoVehiculo = function(tipoVehiculo_id, precioDesde, precioHasta){
	  var precioDesde = $("#price_from").val();
	  var precioHasta = $("#price_to").val();
	  precioDesde = precioDesde.replace(/,/g, '') || 0;
	  precioHasta = precioHasta.replace(/,/g, '') || 9999999999999;
	  rc.modelos = Modelos.find({tipoVehiculo_id : tipoVehiculo_id},{fields : {_id : 1}}).fetch();
	  var modelos_id = _.pluck(rc.modelos, "_id");
	  var query = {modelo_id : { $in : modelos_id}, precioSugerido : { $gte :parseInt(precioDesde), $lt : parseInt(precioHasta)}};
	  rc.versiones = Versiones.find(query).fetch();
	  _.each(rc.versiones, function(version){
		  version.modelo = Modelos.findOne({_id : version.modelo_id});
	  });
  }

  this.mostrarAgencia = function(version){
	  rc.versionAContactar = Versiones.findOne(version._id);
	  rc.modeloAContactar = Modelos.findOne(version.modelo_id);
	  rc.marcaAContactar = Marcas.findOne(version.marca_id);
  }

  this.estadoSeleccionado = function(estado_id){
	  rc.ciudades = Ciudades.find({estado_id : parseInt(estado_id)}).fetch();
  }

  this.limpiar = function(){
	  rc.versiones = [];
  }
};
