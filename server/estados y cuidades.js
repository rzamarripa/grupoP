Meteor.publish("estados",function(options){
  return Estados.find(options);
});

Meteor.publish("ciudades",function(options){
  return Ciudades.find(options);
});