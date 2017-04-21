angular.module("casserole")
.controller("VersionesCtrl", VersionesCtrl);  
 function VersionesCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
 	let rc = $reactive(this).attach($scope);
  
  this.action = true;
  this.nuevo = true;
  this.version = {};
  this.scroll = 0;
  window.rc = rc;
  
  this.subscribe('modelos',()=>{
		return [{estatus : true, _id : $stateParams.modelo_id}]
	});
  
	this.subscribe('marcas',()=>{
		return [{estatus : true, _id : $stateParams.marca_id}]
	});
	
	this.subscribe('versiones',()=>{
		return [{modelo_id : $stateParams.modelo_id}]
	});

	this.helpers({
	  marca : () => {
		  return Marcas.findOne(this.getReactively("modelo.marca_id"));
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
    this.version = {
			abs:"",
			aceleracion0100:"",
			airbag:"",
			aireAcondicionado:"",
			alarmaInmovilizadorMotor:"",
			alarmaLucesEncendidas:"",
			alimentacion:"",
			alto:"",
			alturaPiso:"",
			anchoConEspejos:"",
			anchoSinEspejos:"",
			anclajeAsientosInfantiles:"",
			aperturaCajuelaTapaCombustible:"",
			aperturaRemotaGarage:"",
			asientosDelanteros:"",
			asientosTraseros:"",
			asistenciaFrenadaEmergencia:"",
			autobloqueoPuertasVelocidad:"",
			bocinas:"",
			cajuela:"",
			camaraVisionTrasera:"",
			capacidadCarga:"",
			cierrePuertas:"",
			cilindrada:"",
			cilindros:"",
			cinturonesSeguridad:"",
			combustible:"",
			computadoraBordo:"",
			conexionAuxiliar:"",
			conexionUsb:"",
			controlEstabilidad:"",
			controlTraccion:"",
			controlVelocidadCrucero:"",
			direccionAsistida:"",
			distanciaEntreEjes:"",
			distribucionElectronicaFrenado:"",
			equipoMusica:"",
			espejoInterior:"",
			espejosExteriores:"",
			fabricadoEn:"",
			farosAntiniebla:"",
			farosDelanteros:"",
			frenosDelTras:"",
			garantia:"",
			interfazBluetooth:"",
			largo:"",
			motorTraccion:"",
			neumaticos:"",
			neumaticosDelanteros:"",
			neumaticosTraseros:"",
			nombre:"",
			otros:"",
			palancaCambios:"",
			pantallaTablero:"",
			peso:"",
			potencia:"",
			precioSugerido:"",
			quemacocos:"",
			rendimientoCiudad:"",
			rendimientoMixto:"",
			rendimientoRuta:"",
			reproduccionAudioViaBluetooth:"",
			rines:"",
			sensoresEstacionamiento:"",
			sistemaNavegacion:"",
			suspencionTrasera:"",
			suspensionDelantera:"",
			tanqueCombustible:"",
			terceraLuzStop:"",
			torque:"",
			transmision:"",
			valvulas:"",
			velocidadMaxima:"",
			vestiduras:"",
			vidriosDelTras:"",
			volante:""
	    
    };		
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
		console.log(version);
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
    rc.scroll = $(window).scrollTop();
    $("html, body").animate({ scrollTop: 0 }, "slow");
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
		$("html, body").animate({ scrollTop: rc.scroll }, "slow");
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
  
  this.duplicar = function(version_id){
	  var versionNueva = Versiones.findOne(version_id);
	  delete versionNueva._id;
	  this.version = versionNueva;
	  $('.collapse').collapse('show');
	  $("html, body").animate({ scrollTop: 0 }, "slow");
	  this.nuevo = true;
		return false;
  }
	
};

/*
  this.version = {
		abs:"abs",
		aceleracion0100:"acele",
		airbag:"air",
		aireAcondicionado:"aire aco",
		alarmaInmovilizadorMotor:"ala e imnv",
		alarmaLucesEncendidas:"alar",
		alimentacion:"aliment",
		alto:"alto",
		alturaPiso:"altura",
		anchoConEspejos:"ancho con es",
		anchoSinEspejos:"ancho s es",
		anclajeAsientosInfantiles:"ancla para asientos inf",
		aperturaCajuelaTapaCombustible:"aper caj",
		aperturaRemotaGarage:"ape remo",
		asientosDelanteros:"asin del",
		asientosTraseros:"asis tra",
		asistenciaFrenadaEmergencia:"asdi",
		autobloqueoPuertasVelocidad:"autobl",
		bocinas:"boci",
		cajuela:"caj",
		camaraVisionTrasera:"cama",
		capacidadCarga:"capac",
		cierrePuertas:"cierr puer",
		cilindrada:"cili",
		cilindros:"cilindro",
		cinturonesSeguridad:"cinturo de se",
		combustible:"combu",
		computadoraBordo:"compu de a bor",
		conexionAuxiliar:"con aux",
		conexionUsb:"usb",
		controlEstabilidad:"control. de es",
		controlTraccion:"contr de tra",
		controlVelocidadCrucero:"con de vel",
		direccionAsistida:"dir asis",
		distanciaEntreEjes:"dista",
		distribucionElectronicaFrenado:"dis",
		equipoMusica:"equipo de mu",
		espejoInterior:"esp inte",
		espejosExteriores:"esp ext",
		fabricadoEn:"fabricado",
		farosAntiniebla:"fa anti",
		farosDelanteros:"fa del",
		frenosDelTras:"frenos",
		garantia:"garanti",
		interfazBluetooth:"inter blue",
		largo:"lar",
		marca_id:"gj5dz7uZcMeYyYhAW",
		modelo_id:"dQAcnxRuB6pyLvndg",
		motorTraccion:"motor",
		neumaticos:"neuma",
		neumaticosDelanteros:"neu del",
		neumaticosTraseros:"neu tra",
		nombre:"Version 1",
		otros:"otros",
		palancaCambios:"pala de ca",
		pantallaTablero:"pan en table",
		peso:"peso",
		potencia:"potencia",
		precioSugerido:"precio",
		quemacocos:"quema",
		rendimientoCiudad:"rendimi ciu",
		rendimientoMixto:"rend mix",
		rendimientoRuta:"rend ruta",
		reproduccionAudioViaBluetooth:"reprodu de aud via blue",
		rines:"rin",
		sensoresEstacionamiento:"sen",
		sistemaNavegacion:"sis de nav",
		suspencionTrasera:"sus tra",
		suspensionDelantera:"sus del",
		tanqueCombustible:"tanqu",
		terceraLuzStop:"ter luz st",
		torque:"tor",
		transmision:"trans",
		valvulas:"valv",
		velocidadMaxima:"valoci",
		vestiduras:"ves",
		vidriosDelTras:"vidr",
		volante:"vol"
    
  };
*/
