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
	var n = 10;

	function getPacket(index) {
		var packet = {};
		var data = [];
		var d = {
					packet: 0,
					ecg: { data: data }
				};
		var i;
		for (i = 0; i < 200; i++) {
			data.push(i * n);
		}
		d.packet = index;
		packet["payload"] = { d: d };
		packet["destinationName"] = "test1";
		packet["payloadString"] = JSON.stringify(packet.payload);
		return packet;
	}

	function connect() {
		options.statusHandler("connected to emulator");
		//setInterval(sendPacket, 1000);
		setTimeout(sendPacket, 1000);
	}

	function sendPacket() {
		options.messageHandler(getPacket(counter));
		counter ++;
		if (counter > 10)
			n = 100;
		if (counter > 20)
			n = 10;
		if (counter < 30)
			setTimeout(sendPacket, 1000);
	}

	return {
		connect: connect,
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