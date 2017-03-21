angular.module("casserole")
.controller("MarcasCtrl", MarcasCtrl);  
 function MarcasCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
 	let rc = $reactive(this).attach($scope);
  
  this.action = true;
  this.nuevo = true;
  window.rc = rc;
  
	this.subscribe('marcas',()=>{
		return [{}]
	 });

	this.helpers({
	  marcas : () => {
		  return Marcas.find();
	  }
  });
  
  this.nuevaMarca = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.marca = {};		
    $('#imagen').val("");
  };
  
  this.guardar = function(marca,form)
	{
		if(form.$invalid){
      toastr.error('Error al guardar los datos.');
      return;
	  }
	  
		marca.estatus = true;
		marca.usuarioInserto_id = Meteor.userId();
		
		Marcas.insert(marca);
		
		toastr.success('Guardado correctamente.');
		this.marca = {}; 
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};
	
	this.editar = function(id)
	{
    this.marca = Marcas.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};
	
	this.actualizar = function(marca,form)
	{
		if(form.$invalid){
      toastr.error('Error al actualizar los datos del Turno.');
      return;
	  }
		var idTemp = marca._id;
		delete marca._id;		
		marca.usuarioActualizo_id = Meteor.userId(); 
		Marcas.update({_id:idTemp},{$set:marca});
		toastr.success('Actualizado correctamente.');
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};

	this.cambiarEstatus = function(id)
	{
		var marca = Marcas.findOne({_id:id});
		if(marca.estatus == true)
			marca.estatus = false;
		else
			marca.estatus = true;
		
		Marcas.update({_id: id},{$set :  {estatus : marca.estatus}});
  };
  
  this.AlmacenaImagen = function(imagen)
	{	
		this.marca.imagen = imagen;
	}
  
  $(document).ready( function() {
		
		var imagen = document.getElementById('imagen');			
		var fileDisplayArea1 = document.getElementById('fileDisplayArea1');
		
					
		//JavaScript para agregar el Curp Imagen
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
