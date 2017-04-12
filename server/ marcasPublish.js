Meteor.publish("marcas", function(options){
	return Marcas.find(options);
});

Meteor.publish("agencias", function(options){
	return Agencias.find(options);
});

Meteor.publish("modelos", function(options){
	console.log(options);
	return Modelos.find(options);
});

Meteor.publish("versiones", function(options){
	return Versiones.find(options);
});
