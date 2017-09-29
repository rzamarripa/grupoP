angular.module("casserole")
.controller("ComparadorCtrl", ComparadorCtrl);
 function ComparadorCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
 	let rc = $reactive(this).attach($scope);

  var $scrollingDiv = $("#scrollingDiv");
	var $listaComparativa = $("#listaComparativa");
	$(window).scroll(function(){
		if ($(window).scrollTop()>50){
    	$scrollingDiv
				.css("position",'fixed' )
				.css("top",'0px' )
				.css("background-color", "white")
				.css("z-index", 1)
				.css("border-bottom", "1px solid #ddd")
				.css("padding-bottom", "3px");
		} else {
			$scrollingDiv
      	.css("position",'' )
        .css("top",'' )
        .css("background-color", "")
        .css("border-bottom", "")
        .css("padding-bottom", "");
		}
	});

  this.action = true;
  this.nuevo = true;
  this.comparando = false;
  this.etiquetas = [
	  "Nombre",
	  "Precio sugerido",
	  "Garantía",
	  "Fabricado en",
	  "Combustible",
	  "Cilindrada",
	  "Potencia",
	  "Torque",
	  "Cilindros",
	  "Válvulas",
	  "Alimentación",
	  "Aceleración 0-100 km/h",
	  "Velocidad máxima",
	  "Rendimiento en ciudad",
	  "Rendimiento en ruta",
	  "Rendimiento mixto",
	  "Motor - Tracción",
	  "Transmisión",
	  "Frenos (Del. - Tras.)",
	  "Neumáticos",
	  "Neumáticos delanteros",
	  "Neumáticos traseros",
	  "Suspensión delantera",
	  "Suspensión trasera",
	  "Dirección asistida",
	  "Largo",
	  "Ancho sin espejos",
	  "Ancho con espejos",
	  "Alto",
	  "Distancia entre ejes",
	  "Cajuela",
	  "Tanque de combustible",
	  "Peso",
	  "Capacidad de carga",
	  "Altura de piso",
	  "Aire acondicionado",
	  "Alarma de luces encendidas",
	  "Asientos delanteros",
	  "Asientos traseros",
	  "Cierre de puertas",
	  "Computadora de a bordo",
	  "Espejo interior",
	  "Espejos exteriores",
	  "Faros antiniebla",
	  "Faros delanteros",
	  "Palanca de cambios",
	  "Quemacocos",
	  "Rines",
	  "Vestiduras",
	  "Control de velocidad crucero",
	  "Vidrios (del. - tras.)",
	  "Volante",
	  "Apertura cajuela y tapa comb.",
	  "Apertura remota de garage",
	  "Sensores de estacionamiento",
	  "Cámara de visión trasera",
	  "Airbag",
	  "ABS",
	  "Distribución electrónica de frenado",
	  "Asistencia en frenada de emergencia",
	  "Alarma e inmovilizador de motor",
	  "Anclaje para asientos infantiles",
	  "Cinturones de seguridad",
	  "Otros",
	  "Tercera luz de stop",
	  "Autobloqueo de puertas con velocidad",
	  "Control de estabilidad",
	  "Control de tracción",
	  "Equipo de música",
	  "Bocinas",
	  "Conexión auxiliar (iPod y Mp3)",
	  "Conexión USB",
	  "Interfaz bluetooth",
	  "Sistema de navegación",
	  "Pantalla en tablero",
	  "Reproducción de audio vía bluetooth"
  ];
  this.idsSeleccionadas = Array(4).fill(undefined);
  this.marcas_ids = Array(4).fill(undefined);
	this.modelos_ids = Array(4).fill(undefined);
	this.versiones_ids = Array(4).fill(undefined);
	this.versionesSeleccionadas = Array(4).fill(undefined);
	this.imagenesSeleccionadas = Array(4).fill(undefined);
	this.versionSeleccionada = {};
	this.versionAContactar = {};
	this.modeloAContactar = {};
	this.marcaAContactar = {};
	this.ciudades = [];
	this.estado_id = "";

	this.modelos = Array(4).fill([]);
	this.versiones = Array(4).fill([]);
	this.marcaActualizar = function(){
		rc.modelos[rc.numero] = Modelos.find({marca_id : rc.marcas_ids[rc.numero]}).fetch();
		rc.versionesSeleccionadas[rc.numero] = undefined;
	};
	this.modeloActualizar = function(){
		rc.versiones[rc.numero] = Versiones.find({modelo_id : rc.modelos_ids[rc.numero]}).fetch();
/*
		rc.versiones[rc.numero][1] = {
			marca_id : rc.versiones[rc.numero][0].marca_id,
			modelo_id : rc.versiones[rc.numero][0].modelo_id,
			marca : Marcas.findOne(rc.versiones[rc.numero][0].marca_id),
			agencia : Agencias.findOne({marca_id : rc.versiones[rc.numero][0].marca_id})
		}
*/
		rc.versionesSeleccionadas[rc.numero] = undefined;
	};

	this.numero = 0;
	window.rc = rc;

  this.subscribe('marcas',()=>{
		return [{estatus : true}]
	});

	this.subscribe('agencias',()=>{
		return [{estatus : true}]
	});

	this.subscribe('estados',()=>{
		return [{}]
	});

	this.subscribe('ciudades',()=>{
		return [{}]
	});

  this.subscribe('modelos', ()=>{
		return [{estatus : true, marca_id : { $in : this.getCollectionReactively("marcas_ids")}}]
	},{
		onReady : this.marcaActualizar
	});

	this.subscribe('versiones',()=>{
		return [{estatus : true, modelo_id : { $in : this.getCollectionReactively("modelos_ids")}}]
	},{
		onReady : this.modeloActualizar
	});

	this.helpers({
	  marcas : () => {
		  return Marcas.find({},{sort : {nombre : 1}});
	  },
	  estados : () => {
		  return Estados.find();
	  }
  });

  this.getMarca = function(numero, marca_id){
	  this.marcas_ids[numero] = marca_id;
	  this.numero = numero;
  }

  this.getModelos = function(numero, modelo_id){
	  var modelo = Modelos.findOne(modelo_id);
	  this.modelos_ids[numero] = modelo_id;
	  this.imagenesSeleccionadas[numero] = modelo.imagen;
	  this.numero = numero;
  }

  this.getVersiones = function(numero, version_id){
	  this.versiones_ids[numero] = version_id;
	  var versionActual = Versiones.findOne(version_id);
	  if(versionActual._id != undefined){
		  rc.idsSeleccionadas[numero] = versionActual._id;
		  delete versionActual._id;
		  delete versionActual.marca_id;
		  delete versionActual.modelo_id;
		  delete versionActual.usuarioInserto_id;
		  delete versionActual.usuarioActualizo_id;
		  delete versionActual.estatus;
		  this.versionesSeleccionadas[numero] = versionActual;

	  }
  }

  this.comparar = function(){
	  this.comparando = true;
  }

  this.mostrarCiudades = function(indice, version){
	  console.log(indice, version);
	  rc.versionAContactar = Versiones.findOne(rc.idsSeleccionadas[indice]);
	  rc.modeloAContactar = Modelos.findOne(rc.versionAContactar.modelo_id);
	  rc.marcaAContactar = Marcas.findOne(rc.modeloAContactar.marca_id);
/*
	  var agencias = Agencias.find({marca_id : rc.versionAContactar.marca_id}).fetch();
	  rc.ciudades = [];
	  _.each(agencias, function(agencia){
		  rc.ciudades.push({
			  nombre : agencia.ciudad,
			  agencia_id : agencia._id
		  })
	  });
*/

  }

  this.enviarEmail = function(formModal, correo){

	  if(formModal.$invalid){
      toastr.error('Los campos rojos no pueden ir vacíos y debe ser un correo válido.');
      return;
	  }else{
			$('#formModal')[0].reset();
	  }
	  NProgress.start()
	  //var agencia = Agencias.findOne(rc.versionSeleccionada.agencia_id);
	  var marca = Marcas.findOne(rc.modeloAContactar.marca_id);
	  var modelo = Modelos.findOne(rc.versionAContactar.modelo_id);
	  var agencias = Agencias.find({marca_id : marca._id}).fetch();
	  var correoAgencia = "";
	  var existe = false;

	  _.each(agencias, function(agencia){
		  if(agencia.ciudad_id == correo.ciudad_id){
			  existe = true;
			  rc.agenciaSeleccionada = agencia;
		  }
	  });

	  if(existe){
		  rc.agenciaAContactar = Agencias.findOne(rc.agenciaSeleccionada._id);
	  }else{
		  rc.agenciaAContactar = Agencias.findOne({marca_id : marca._id, default : true});
	  }

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
	  $('#myModal').modal('hide');

	  Meteor.apply("sendEmail",
	  	[rc.agenciaAContactar.correo,
	  	de,
	  	"Lead Comparador",
	  	comentario], function(error, result){
		  	NProgress.set(0.4);
		  	if(result){
			  	NProgress.done();
			  	BitacoraCorreos.insert({
				  	nombre : correo.nombre,
				  	telefono : correo.telefono,
				  	correo : correo.correo,
				  	marca : marca.nombre,
				  	marca_id : marca._id,
				  	agencia : rc.agenciaAContactar.nombre,
				  	agencia_id : rc.agenciaAContactar._id,
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

  this.estadoSeleccionado = function(estado_id){
	  console.log(estado_id);
	  rc.ciudades = Ciudades.find({estado_id : parseInt(estado_id)}).fetch();
  }

};
