/***
 *  
 *  options:
 *      host: host uri
 *      port: port number
 *      topic: topic string
 *      statusHandler: function(text-message)
 *      messageHandler: function(message)
 */
var Subscriber = function(userOptions) {
    var mqtt;
    var reconnectTimeout = 2000;
    var options = userOptions;

    // default options
    defaultStatusHandler = function(msg) {
        console.log('status: ' + msg);
    }

    defaultMessageHandler = function(msg) {
        console.log('message: ' + msg.toString());
    }

    var connect = function () {
        // default options
        if (typeof options.statusHandler != "function") {
            options.statusHandler = defaultStatusHandler;
        }

        if (typeof options.messageHandler != "function") {
            options.messageHandler = defaultMessageHandler;
        }
        mqtt = new Paho.MQTT.Client(
                        options.host, options.port,
                        "web_" + parseInt(Math.random() * 100,
                        10));
        var opts = {
            timeout: 3,
            useSSL: false,
            cleanSession: true,
            onSuccess: onConnect,
            onFailure: onFailure,
        };

        mqtt.onConnectionLost = onConnectionLost;
        mqtt.onMessageArrived = onMessageArrived;

        options.statusHandler("Host="+ host + ", port=" + port + " TLS = " + useTLS + " username=" + username + " password=" + password);
        mqtt.connect(opts);
    }

    function onConnect() {
        options.statusHandler('Connected to ' + host + ':' + port);
        // Connection succeeded; subscribe to our topic
        if (options.topic == undefined)
            options.topic = "#";

        mqtt.subscribe(topic, {qos: 0});
        options.statusHandler("subscribe to: " + topic);
    }

    function onFailure(msg) {
        options.statusHandler("Connection failed: " + msg.errorMessage + "Retrying");
        setTimeout(connect, reconnectTimeout);
    }

    function onConnectionLost(response) {
        options.statusHandler("connection lost: " + response.errorMessage + ". Reconnecting");
        setTimeout(connect, reconnectTimeout);
    };

    function onMessageArrived(message) {
        //options.statusHandler("received message");
        try {
            options.messageHandler(message);
        } catch(err) {
            console.log("!!! json string error: " + message);
        }
    };

    return {
        connect: connect,
    }
}