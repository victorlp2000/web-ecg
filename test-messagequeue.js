var msgq = require('./messagequeue');

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

// check tail pointer move step by step
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
// circle to top
checkPutReturn(q.putMessage({packet:5}), 5);
checkPointers(1, 0);
checkPutReturn(q.putMessage({packet:6}), 5);
checkPointers(2, 1);

// reset queue
checkPutReturn(q.putMessage({packet:0}), 1);
checkPointers(0, 1);
checkPutReturn(q.putMessage({packet:1}), 2);
checkPutReturn(q.putMessage({packet:2}), 3);
checkPutReturn(q.putMessage({packet:3}), 4);
checkPutReturn(q.putMessage({packet:4}), 5);
checkPutReturn(q.putMessage({packet:5}), 5);
checkPutReturn(q.putMessage({packet:6}), 5);
checkPointers(2, 1);

q.printMap();
// get one by one
checkGetReturn(q.getMessage(), 2);
checkPointers(3, 1);
checkGetReturn(q.getMessage(), 3);
checkPointers(4, 1);
checkGetReturn(q.getMessage(), 4);
checkPointers(5, 1);
// circle back
checkGetReturn(q.getMessage(), 5);
checkPointers(0, 1);
checkGetReturn(q.getMessage(), 6);
checkPointers(1, 1);
// over empty
checkGetReturn(q.getMessage(), null);
checkPointers(1, 1);

q.putMessage({packet:0});
checkPointers(0, 1);
q.putMessage({packet:1});
checkPointers(0, 2);
// jump
q.putMessage({packet:4});
checkPointers(0, 5);
// fill 
q.putMessage({packet:2});
checkPointers(0, 5);
// fill
q.putMessage({packet:3});
checkPointers(0, 5);

// turn to top
q.putMessage({packet:5});
checkPointers(1, 0);
q.putMessage({packet:6});
checkPointers(2, 1);
// jump
q.putMessage({packet:8});
checkPointers(4, 3);
q.putMessage({packet:7});
checkPointers(4, 3);
q.putMessage({packet:9});
checkPointers(5, 4);

q.getMessage();
checkPointers(0, 4);
q.getMessage();
checkPointers(1, 4);
q.getMessage();
checkPointers(2, 4);
q.getMessage();
checkPointers(3, 4);
q.getMessage();
checkPointers(4, 4);
q.getMessage();
checkPointers(4, 4);

q.putMessage({packet:0});
checkPointers(0, 1);
q.putMessage({packet:1});
checkPointers(0, 2);
// duplicate
q.putMessage({packet:2});
checkPointers(0, 3);
q.putMessage({packet:2});
checkPointers(0, 3);
q.putMessage({packet:3});
checkPointers(0, 4);
//q.printMap();
