Avisos = new Mongo.Collection("avisos");

Avisos.allow({
  insert: function (userId, doc) { return !Roles.userIsInRole(userId, 'alumno'); },
  update: function (userId, doc) { return !Roles.userIsInRole(userId, 'alumno'); },
  remove: function (userId, doc) { return !Roles.userIsInRole(userId, 'alumno'); }
});