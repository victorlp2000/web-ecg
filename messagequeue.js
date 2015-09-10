/*
messsage = {
    packet: sequence number
    ecg: {
        start_time: miliseconds
        ecg: [data1, data2, ...]
    }
    others:
};

using circle buffer as queue, like:
                +-----------+
                |           |
                +-----------+
        head--> | message-1 |
                +-----------+
                | message-2 |
                +-----------+
                |    ...    |
                +-----------+
                | message-N |
                +-----------+
        tail--> |           |
                +-----------+
                |           |
*/

/***
 *  maxItems - maximum number of items keep in queue
 */
function MessageQueue(maxItems) {
    var queue = new Array();
    var queueSize = maxItems || 10;
    var lastPacket = -1;
    var head = 0;   // point to head in queue
    var tail = 0;   // point to tail in queue
    var offset = 0; // element index in head item

    queueSize ++;   // circle buffer has one item empty
                    // so here plus one

    function next(current) {
        var check = current + 1;
        if (check >= queueSize) {
            check = 0;
        }
        return check;
    }

    function prev(current) {
        var check = current - 1;
        if (check < 0) {
            check = queueSize - 1;
        }
        return check;
    }

    /***
     * print map of the queue
     */
    function printMap() {
        var i, mark;
        console.log('-----' + (queueSize-1) + '-----');
        for (i = 0; i < queueSize; i++) {
            mark = "";
            if (head == i) {
                mark += "h";
            } else {
                mark += " ";
            }
            if (tail == i) {
                mark += "t";
            } else {
                mark += " ";
            }
            if (queue[i] != null) {
                msg = queue[i].packet;
            } else {
                msg = "";
            }
            console.log(mark + '|' + msg);
        }
    }

    function getHead() {
        return head;
    }

    function getTail() {
        return tail;
    }

    /***
     * return number of items in the queue
     */
    function getNumberOfMessages() {
        if (head == tail) {
            return 0;
        }
        if (head < tail) {
            return tail - head;
        }
        return tail + queueSize - head;
    }

    /***
     *   put new message into queue,
     *   return number of items in the queue
     */
    function putMessage(message) {
        var index = message.packet % queueSize;

        // start a new list
        if (message.packet == 0) {
            head = tail = 0;
        }
        // queue is empty, put at the index
        if (head == tail) {
            head = index;
            queue[head] = message;
            tail = next(head);
            lastPacket = message.packet;
        } else if (message.packet <= lastPacket) {
            // if message not in sequence, it must between
            // head and tail, otherwise it will be ignored
            if (head < tail) {
                if (index >= head && index < tail) {
                    queue[index] = message;
                } else {
                    console.log("message expired.");
                }
            } else {
                if (index < tail || index >= head) {
                    queue[index] = message;
                } else {
                    console.log("message expired.");
                }
            }
            // keep the lastPacket
        } else {
            while (index != tail) {
                queue[tail] = null;
                tail = next(tail);
                if (tail == head) {
                    head = next(head);
                }
            }
            queue[tail] = message;
            tail = next(tail);
            if (tail == head) {
                head = next(head);
            }
            lastPacket = message.packet;
        }
        return getNumberOfMessages();
    }

    function saveQueue() {
        var saveHead = head;
        var saveTail = tail;
        var msg;
        var msgs = 0;
        console.log("saving...");
        while (head != tail) {
            msg = getMessage();
            if (msg != null) {
                console.log(msg);
                msgs ++;
            }
        }
        head = saveHead;
        tail = saveTail;
        console.log("--saved: " + msgs);
        return msgs;
    }

    function getMessage() {
        if (head != tail) {
            var message = queue[head];
            head = next(head);
            return message;
        }
        return null;
    }
    return {
        printMap: printMap,
        getHead: getHead,
        getTail: getTail,
        getNumberOfMessages: getNumberOfMessages,
        putMessage: putMessage,
        getMessage: getMessage,
        saveQueue: saveQueue,
    }
}

module.exports = {
    MessageQueue: MessageQueue,
}