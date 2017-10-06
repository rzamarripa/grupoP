Meteor.methods({
  getMarcas: function () {
	  return Marcas.find({estatus : true},{ sort : { nombre : 1}}).fetch();
	}
})