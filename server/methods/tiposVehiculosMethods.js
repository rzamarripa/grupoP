Meteor.methods({
  getTiposVehiculos: function () {
	  return TiposVehiculos.find({estatus : true},{ sort : { nombre : 1}}).fetch();
	}
})