angular.module("casserole").controller("RootCtrl", RootCtrl);  
function RootCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
	let rc = $reactive(this).attach($scope); 
	this.usuarioActual = {};
	this.avisosVentana = "none";
	this.grupos_id = [];
	this.hoy = new Date();
	
	if(Meteor.user() && Meteor.user().roles && Meteor.user().roles[0] == "agencia"){
		// Agencia
				
		
	}
	
	this.autorun(function() {
 	
    if(Meteor.user() && Meteor.user()._id){
      rc.usuarioActual=Meteor.user();
    }
    
  });
  
	this.muestraAvisos = function(){
	  if(rc.avisosVentana == "none"){
		  rc.avisosVentana = "block";
	  }else{
		  rc.avisosVentana = "none";
	  }
  }
  
  this.fechaTitulo = function(date){
		moment.locale("es");
    return moment(date).calendar();
	}
	
	this.tieneFoto = function(sexo, foto){
	  if(foto === undefined){
		  if(sexo === "masculino")
			  return "img/badmenprofile.png";
			else if(sexo === "femenino"){
				return "img/badgirlprofile.png";
			}else{
				return "img/badprofile.png";
			}
			  
	  }else{
		  return foto;
	  }
  };
	
	this.cambiarEstatus = function(aviso_id){
		var aviso = MensajesVendedores.findOne(aviso_id);
		if(aviso){
			MensajesVendedores.update({_id : aviso_id}, { $set : {estatus : !aviso.estatus}});
			if(aviso.estatus){
				toastr.success("Mensaje leído.");
			}else{
				toastr.info("Mensaje no leído");
			}
		}		
	}
};