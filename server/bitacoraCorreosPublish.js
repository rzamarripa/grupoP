Meteor.publish("bitacoraCorreos",function (options) {
  console.log(options);
	//Counts.publish(this, 'numberOfBitacoraCorreos', BitacoraCorreos.find(options), {noReady: true});
	return BitacoraCorreos.find(options);
});
