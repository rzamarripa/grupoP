Meteor.methods({
  getEstados: function () {
	  return Estados.find({},{ sort : { nombre : 1}}).fetch();
	},
	getCiudades: function (estado_id) {
	  return Ciudades.find({estado_id : parseInt(estado_id)},{ sort : { nombre : 1}}).fetch();
	}
})