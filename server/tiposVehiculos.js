Meteor.publish("tiposVehiculos", function(params){
	return TiposVehiculos.find(params);
})