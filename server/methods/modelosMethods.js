Meteor.methods({
  getModelos: function (marca_id) {
	  return Modelos.find({estatus : true, marca_id : marca_id},{ sort : { nombre : 1}}).fetch();
	}
})