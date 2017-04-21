angular.module("casserole")
.controller("ModelosCtrl", ModelosCtrl);  
 function ModelosCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
 	let rc = $reactive(this).attach($scope);
  
  this.action = true;
  this.nuevo = true;
  window.rc = rc;
  this.scroll = 0;
  
	this.subscribe('modelos',() => {
		return [{marca_id : Meteor.user() ? Meteor.user().profile.marca_id : ""}];
	});
	
	this.subscribe('marcas',() => {
		return [{estatus : true}]
	});
	
	this.subscribe('tiposVehiculos',() => {
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
	  },
	  tiposVehiculos : () => {
		  return TiposVehiculos.find();
	  }
  });
  
  this.nuevoModelo = function(){
    this.action = true;
    this.nuevo = !this.nuevo;
    this.modelo = {};		
    $('#imagen').val("");
  }; 
  
  this.guardar = function(modelo,form){
		if(form.$invalid){
      toastr.error('Error al guardar los datos.');
      return;
	  }
		modelo.estatus = true;
		modelo.usuarioInserto_id = Meteor.userId();
		modelo.marca_id = Meteor.user().profile.marca_id;
		Modelos.insert(modelo);
		toastr.success('Guardado correctamente.');
		this.modelo = {}; 
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};
	
	this.editar = function(id){
    this.modelo = Modelos.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
		rc.scroll = $(window).scrollTop();
    $("html, body").animate({ scrollTop: 0 }, "slow");
    this.nuevo = false;
	};
	
	this.actualizar = function(modelo,form){
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
		$("html, body").animate({ scrollTop: rc.scroll }, "slow");
		this.nuevo = true;
	};

	this.cambiarEstatus = function(id){
		var modelo = Modelos.findOne({_id:id});
		if(modelo.estatus == true)
			modelo.estatus = false;
		else
			modelo.estatus = true;
		
		Modelos.update({_id: id},{$set : {estatus : modelo.estatus}});
  };
  
  this.AlmacenaImagen = function(imagen){	
		this.modelo.imagen = imagen;
	}
  
  $(document).ready( function() {
		var imagen = document.getElementById('imagen');			
		var fileDisplayArea1 = document.getElementById('fileDisplayArea1');
		//JavaScript para agregar la imagen
		imagen.addEventListener('change', function(e) {
			var file = imagen.files[0];
			var imageType;
			if (file.type == "application/pdf")
					imageType = /application.*/;
			else
					imageType = /image.*/;
			//console.log(imageType);
			if (file.type.match(imageType)) {
				if (file.size <= 1000000)
				{
					var reader = new FileReader();
					reader.onload = function(e) {
						rc.AlmacenaImagen(reader.result);
					}
					reader.readAsDataURL(file);
				}else {
					toastr.error("Error el archivo supera 1 MB");
					return;
				}
			} else {
				fileDisplayArea1.innerHTML = "File not supported!";
			}			
		});
	});
	
};
