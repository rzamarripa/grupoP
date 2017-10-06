Meteor.methods({
  getVersiones: function (modelo_id) {
	  var modelo = Modelos.findOne(modelo_id);
	  var versiones = Versiones.find({estatus : true, modelo_id : modelo_id},{ sort : { precioSugerido : 1}}).fetch();
		_.each(versiones, function(version){
			version.modelo = modelo;
		});
		return versiones;
	},
	getVersionesPorTipoVehiculo: function (tipoVehiculo_id, precioDesde, precioHasta) {
	  var modelos = Modelos.find({tipoVehiculo_id : tipoVehiculo_id}).fetch();
	  var modelos_ids = _.pluck(modelos, "_id");
	  var versiones = Versiones.find({modelo_id : { $in : modelos_ids}, precioSugerido : { $gte :parseInt(precioDesde), $lt : parseInt(precioHasta)}}, {sort : { precioSugerido : 1 }}).fetch();
		_.each(versiones, function(version){
			version.modelo = Modelos.findOne(version.modelo_id);
		});
		return versiones;
	},
	getVersionModeloMarcaPorTipoVehiculo: function(version_id){
		var version = Versiones.findOne(version_id);
		var modelo = Modelos.findOne(version.modelo_id);
		var marca = Marcas.findOne(version.marca_id);

		return [version, modelo, marca];
	},
	enviarEmail: function(marcaAContactar, modeloAContactar, versionAContactar, correo, deDonde){
		var agenciaAContactar = {};
		var correoAgencia = "";
	  var existe = false;
		var cantAgencias = Agencias.find({ciudad_id : correo.ciudad_id, marca_id : marcaAContactar._id}).count();
		if(cantAgencias > 0){
			agenciaAContactar = Agencias.findOne({ciudad_id : correo.ciudad_id, marca_id : marcaAContactar._id});
		}else{
			agenciaAContactar = Agencias.findOne({marca_id : marcaAContactar._id, default : true});
		}

	  if(correo.comentario == undefined)
	  	correo.comentario = "No dejó comentario";
		var comentario = 	"Tienes un nuevo contacto de la página por la sección de " + deDonde + ".<br/><br/>" + correo.comentario + "<br/><br/>" +
	  									"<strong>Marca:</strong> " + marcaAContactar.nombre + "<br/>" +
	  									"<strong>Modelo:</strong> " + modeloAContactar.nombre + "<br/>" +
	  									"<strong>Versión:</strong> " + versionAContactar.nombre + "<br/><br/>" +
	  									"<strong>" + correo.nombre + "</strong><br/>" +
	  									"<strong>Teléfono:</strong> " + correo.telefono + "<br/>" +
	  									"<strong>Correo:</strong> " + correo.correo + "<br/>";
	  var de = "Clientes <" + correo.correo + ">";
	  Meteor.apply("sendEmail",
	  	[agenciaAContactar.correo, de, marcaAContactar.nombre + "-" + modeloAContactar.nombre + "-" + versionAContactar.nombre, comentario],
			function(error, result){
				if(result){
					BitacoraCorreos.insert({
				  	nombre : correo.nombre,
				  	telefono : correo.telefono,
				  	correo : correo.correo,
				  	marca : marcaAContactar.nombre,
				  	marca_id : marcaAContactar._id,
				  	agencia : agenciaAContactar.nombre,
				  	agencia_id : agenciaAContactar._id,
				  	modelo : modeloAContactar.nombre,
				  	modelo_id : modeloAContactar._id,
				  	version : versionAContactar.nombre,
				  	version_id : versionAContactar._id,
				  	deDonde : deDonde,
				  	fecha : new Date(),
				  	semana : moment().isoWeek(),
				  	mes : moment().month() + 1,
				  	dia : moment().date(),
				  	anio : moment().year(),
				  	diaSemana :moment().isoWeekday()
				  });
				}

				if(error){
					console.log(error);
				}
  		}
  	);
  	return true;
	}
});