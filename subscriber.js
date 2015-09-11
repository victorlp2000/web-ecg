/***
 *  
 *  options:
 *      host: host uri
 *      port: port number
 *      statusHandler: function(text-message)
 *      messageHandler: function(message)
 */
function Subscriber(options) {
    var mqtt;
    var reconnectTimeout = 2000;

    // default options
    if (options.statusHandler != "function") {
        options.statusHandler = function(msg) {
            console.log('status: ' + msg);
        };
    }

    if (typeof options.messageHandler != "function") {
        options.messageHandler = function(msg) {
            console.log('message: ' + msg.toString());
        };
    }

    function connect() {
        mqtt = new Paho.MQTT.Client(
                        host, port,
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

        console.log("Host="+ host + ", port=" + port + " TLS = " + useTLS + " username=" + username + " password=" + password);
        mqtt.connect(opts);
    }

    function onConnect() {
        $('#status').val('Connected to ' + host + ':' + port);
        // Connection succeeded; subscribe to our topic
        mqtt.subscribe(topic, {qos: 0});
        $('#topic').val(topic);
    }

    function onFailure(msg) {
        $('#status').val("Connection failed: " + message.errorMessage + "Retrying");
        setTimeout(MQTTconnect, reconnectTimeout);
    }

    function onConnectionLost(response) {
        setTimeout(MQTTconnect, reconnectTimeout);
        $('#status').val("connection lost: " + response.errorMessage + ". Reconnecting");

    };

    function onMessageArrived(message) {
        var topic = message.destinationName;
        var payload = message.payloadString;
        var jsonObject = "";
        try {
            jsonObject = JSON.parse(payload);
        } catch(err) {
            console.log("!!! json string error: " + payload);
        }
        console.log(jsonObject);
        if (processData(topic, jsonObject) == false) {
            console.log(topic + ' = ' + payload);
        }
    };

    // return 'true' if the data is handled
    function processData(topic, data) {
        console.log(topic);
        topics[topic] = Date();
        if ((topic == activeTopic) || (activeTopic == null)) {
            activeTopic = topic;
            if ('d' in data) {
                if ('ecg' in data.d && 'start_ecg' in data.d) {
                    return drawEcg(data.d);
                } else {
                    console.log("no time_ecg or ecg");
                    return false;
                }
            } else {
                console.log("there is no 'd' element in the message");
                return false;
            }
        } else {
            console.log("the topic is not in active: " + topic);
            return false;
        }
    }
