var msgq = require('./message-queue');

var q = msgq.MessageQueue(5);
//console.log(q);

var q2 = msgq.MessageQueue(3);
q2.printMap();

function checkPointers(h, t) {
	if (q.getHead() != h || q.getTail() != t) {
		console.log('h:' + q.getHead() + "<>" + h + " or t:" + q.getTail() + "<>" + t);
	}
}
function checkPutReturn(r, n) {
	if (r != n) {
		console.log('total put:' + r + "<>" + n);
	}	
}
function checkGetReturn(r, n) {
	if (r != null) {
		if (r.packet != n) {
			console.log('got wrong message:' + r.packet + "<>" + n);
		}
	} else {
		if (n != null) {
			console.log('got wrong message:' + 'null' + "<>" + n);	
		}
	}
}

console.log("check tail pointer move step by step...");
checkPutReturn(q.putMessage({packet:0}), 1);
checkPointers(0, 1);
checkPutReturn(q.putMessage({packet:1}), 2);
checkPointers(0, 2);
checkPutReturn(q.putMessage({packet:2}), 3);
checkPointers(0, 3);
checkPutReturn(q.putMessage({packet:3}), 4);
checkPointers(0, 4);
checkPutReturn(q.putMessage({packet:4}), 5);
checkPointers(0, 5);
console.log("circle to top...");
checkPutReturn(q.putMessage({packet:5}), 5);
checkPointers(1, 0);
checkPutReturn(q.putMessage({packet:6}), 5);
checkPointers(2, 1);

console.log("reset queue...");
checkPutReturn(q.putMessage({packet:0}), 1);
checkPointers(0, 1);
checkPutReturn(q.putMessage({packet:1}), 2);
checkPutReturn(q.putMessage({packet:2}), 3);
checkPutReturn(q.putMessage({packet:3}), 4);
checkPutReturn(q.putMessage({packet:4}), 5);
checkPutReturn(q.putMessage({packet:5}), 5);
checkPutReturn(q.putMessage({packet:6}), 5);
checkPointers(2, 1);

console.log("get one by one...");
checkGetReturn(q.getMessage(), 2);
checkPointers(3, 1);
checkGetReturn(q.getMessage(), 3);
checkPointers(4, 1);
checkGetReturn(q.getMessage(), 4);
checkPointers(5, 1);
console.log("circle back...");
checkGetReturn(q.getMessage(), 5);
checkPointers(0, 1);
checkGetReturn(q.getMessage(), 6);
checkPointers(1, 1);
console.log("over empty...");
checkGetReturn(q.getMessage(), null);
checkPointers(1, 1);

console.log("put mis-order...");
checkPutReturn(q.putMessage({packet:0}), 1);
checkPointers(0, 1);
checkPutReturn(q.putMessage({packet:1}), 2);
checkPointers(0, 2);
console.log("jump 2...");
checkPutReturn(q.putMessage({packet:4}), 5);
checkPointers(0, 5);
console.log("fill -2...");
checkPutReturn(q.putMessage({packet:2}), 5);
checkPointers(0, 5);
console.log("fill -1...");
checkPutReturn(q.putMessage({packet:3}), 5);
checkPointers(0, 5);

console.log("circle to top...");
checkPutReturn(q.putMessage({packet:5}), 5);
checkPointers(1, 0);
checkPutReturn(q.putMessage({packet:6}), 5);
checkPointers(2, 1);
console.log("jump 1...");
checkPutReturn(q.putMessage({packet:8}), 5);
checkPointers(4, 3);
console.log("fill back...");
checkPutReturn(q.putMessage({packet:7}), 5);
checkPointers(4, 3);
checkPutReturn(q.putMessage({packet:9}), 5);
checkPointers(5, 4);

console.log("get until empty...");
checkGetReturn(q.getMessage(), 5);
checkPointers(0, 4);
checkGetReturn(q.getMessage(), 6);
checkPointers(1, 4);
checkGetReturn(q.getMessage(), 7);
checkPointers(2, 4);
checkGetReturn(q.getMessage(), 8);
checkPointers(3, 4);
checkGetReturn(q.getMessage(), 9);
checkPointers(4, 4);
checkGetReturn(q.getMessage(), null);
checkPointers(4, 4);

checkPutReturn(q.putMessage({packet:0}), 1);
checkPointers(0, 1);
checkPutReturn(q.putMessage({packet:1}), 2);
checkPointers(0, 2);
// duplicate
checkPutReturn(q.putMessage({packet:2}), 3);
checkPointers(0, 3);
checkPutReturn(q.putMessage({packet:2}), 3);
checkPointers(0, 3);
checkPutReturn(q.putMessage({packet:3}), 4);
checkPointers(0, 4);
//q.printMap();
console.log("put expired");
checkPutReturn(q.putMessage({packet:0}), 1);
checkPutReturn(q.putMessage({packet:1}), 2);
checkPutReturn(q.putMessage({packet:2}), 3);
checkPutReturn(q.putMessage({packet:4}), 5);
checkPutReturn(q.putMessage({packet:5}), 5);
checkGetReturn(q.getMessage(), 1);
checkGetReturn(q.getMessage(), 2);
checkGetReturn(q.getMessage(), null);
checkPutReturn(q.putMessage({packet:4}), 2);
checkPutReturn(q.putMessage({packet:3}), 2);

q.reset();
checkPutReturn(q.putMessage({packet:5}), 1);
q.printMap();
