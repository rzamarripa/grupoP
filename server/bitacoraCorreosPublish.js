Meteor.publish("bitacoraCorreos",function (options) {
	return BitacoraCorreos.find(options);
});
