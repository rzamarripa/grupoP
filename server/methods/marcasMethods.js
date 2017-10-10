Meteor.methods({
  getMarcas: function () {
	  return Marcas.find({estatus : true},{ sort : { nombre : 1}}).fetch();
	},
	getMarcasSinImagen: function () {
	  return Marcas.find({estatus : true},{fields : { nombre : 1}, sort : { nombre : 1}}).fetch();
	}
})