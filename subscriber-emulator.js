/* 	options:
 *      host: host uri
 *      port: port number
 *      topic: topic string
 *      statusHandler: function(text-message)
 *      messageHandler: function(message)
 */
function  SubscriberEmulator(userOptions) {
	var options = userOptions;
	var counter = 0;
	var factor = 10;
	var deviceId = 'emulator';

	function getPacket(index) {
		var packet = {};
		var data = [];
		var d = { packet: 0, ecg: { data: data }};
		var i;
		for (i = 0; i < 200; i++) {
			data.push(i * factor);
		}
		d.packet = index;
		packet["payload"] = { d: d };
		packet["destinationName"] = deviceId;
		packet["payloadString"] = JSON.stringify(packet.payload);
		return packet;
	}

	// for testing very slow case
	function getPacket1(index) {
		var packet = {};
		var data = [];
		var d = { packet: 0, ecg: { data: data }};
		var i;
		data.push(index % 20);
		d.packet = index;
		packet["payload"] = { d: d };
		packet["destinationName"] = deviceId;
		packet["payloadString"] = JSON.stringify(packet.payload);
		return packet;
	}

	function connect() {
		options.statusHandler("connected to emulator");
		//setInterval(sendPacket, 1000);
		sendPacket(sendPacket, 1000);
	}

	function sendPacket() {
		//console.log(deviceId + ": " + counter);
		options.messageHandler(getPacket(counter));
		counter ++;
		setTimeout(sendPacket, 1000);
	}

	function setValueFactor(n) {
		factor = n;
	}

	function setDestination(name) {
		deviceId = name;
	}

	return {
		connect: connect,
		setDestination: setDestination,
		setValueFactor: setValueFactor
	}
}
/*
var options = {
	host: "localhost",
	port: 8080,
	statusHandler : function(text) { console.log(text)},
	messageHandler : function(message) { console.log(message)}
}
subscribe = new SubscriberEmulator(options);
subscribe.connect();
*/