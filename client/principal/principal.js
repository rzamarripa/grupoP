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
	this.deDonde = "";
	this.ciudades = [];
	window.rc = rc;
	this.marcas = [];
	
	Meteor.apply("getMarcas", [], function(error, result){
		if(result){
			rc.marcas = result;
			$scope.$apply();
		}

		if(error){
			console.log(error);
		}
	});
	
	Meteor.apply("getEstados", [], function(error, result){
		if(result){
			rc.estados = result;
			$scope.$apply();
		}

		if(error){
			console.log(error);
		}
	});
	
	Meteor.apply("getTiposVehiculos", [], function(error, result){
		if(result){
			rc.tiposVehiculos = result;
			$scope.$apply();
		}

		if(error){
			console.log(error);
		}
	});

  this.filtrar = function(modelo_id){
	  NProgress.start();
	  rc.deDonde = "Marca modelo";
		NProgress.set(0.4)
		Meteor.apply("getVersiones", [modelo_id], function(error, result){
			if(result){
				rc.versiones = result;
				NProgress.done()
				$scope.$apply();
			}
	
			if(error){
				console.log(error);
			}
		});
  }

  this.enviarEmail = function(formModal, correo){
		NProgress.start();
	  if(formModal.$invalid){
      toastr.error('Los campos rojos no pueden ir vacíos y debe ser un correo válido.');
      return;
	  }else{
			$('#formModal')[0].reset();
	  }
	  NProgress.set(0.4);
	  $('#myModal').modal('hide');
	  Meteor.apply("enviarEmail", [rc.marcaAContactar, rc.modeloAContactar, rc.versionAContactar, correo, rc.deDonde], function(error, result){
		  if(result){
				toastr.success("Gracias por contactarnos, nosotros nos pondremos en contacto lo antes posible.")
			  NProgress.done();
		  }
		  
		  if(error){
			  console.log(error);
		  }
	  })
	  
	  rc.correo = {};
  }

  this.buscarTipoVehiculo = function(tipoVehiculo_id, precioDesde, precioHasta){
	  NProgress.start();
	  rc.deDonde = "Tipo de Automóvil";

	  var precioDesde = $("#price_from").val();
	  var precioHasta = $("#price_to").val();
	  precioDesde = precioDesde.replace(/,/g, '') || 0;
	  precioHasta = precioHasta.replace(/,/g, '') || 9999999999999;
		NProgress.set(0.4)
	  Meteor.apply("getVersionesPorTipoVehiculo", [tipoVehiculo_id, precioDesde, precioHasta], function(error, result){
		  
			if(result){
				rc.versiones = result;
				$scope.$apply();
				NProgress.done();
			}
	
			if(error){
				console.log(error);
			}
		});
  }

  this.mostrarAgencia = function(version){
	  NProgress.start();
	  Meteor.apply("getVersionModeloMarcaPorTipoVehiculo", [version._id], function(error, result){
			if(result){
				rc.versionAContactar = result[0];
			  rc.modeloAContactar = result[1];
			  rc.marcaAContactar = result[2];
			  NProgress.done();
				$scope.$apply();
			}
	
			if(error){
				console.log(error);
			}
		});
  }

  this.estadoSeleccionado = function(estado_id){
	  NProgress.start();
	  Meteor.apply("getCiudades", [estado_id], function(error, result){
			if(result){
				rc.ciudades = result;
				NProgress.done();
				$scope.$apply();
			}
	
			if(error){
				console.log(error);
			}
		});
  }

  this.limpiar = function(){
	  rc.versiones = [];
	  rc.modelos = [];
	  rc.deDonde = "";
	  rc.correo = {};
  }
  
  this.getModelos = function(marca_id){
	  NProgress.start();
	  Meteor.apply("getModelos", [marca_id], function(error, result){
			if(result){
				rc.modelos = result;
				NProgress.done();
				$scope.$apply();
			}
	
			if(error){
				console.log(error);
			}
		});
  }
  
  this.getVersiones = function(modelo_id){
	  NProgress.start();
	  Meteor.apply("getVersiones", [modelo_id], function(error, result){
			if(result){
				rc.versiones = result;
				NProgress.done();
				$scope.$apply();
			}
	
			if(error){
				console.log(error);
			}
		});
  }
};
