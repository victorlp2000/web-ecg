
// each message has a packet number which is in sequence
// we save maxmimum N in queue

var messageQueue = new Array();
var maxMessageInQueue = 10;
var currentIndex = 0;
var endIndex = 0;
var currentOffset = 0;  // offset in packet

/*
messsage = {
    index: sequence number
    ecg: array of data items
}
            +-----------+
            |           |
            +-----------+
currentIndex| message-1 |
            +-----------+
            | message-2 |
            +-----------+
            |    ...    |
            +-----------+
            | message-N |
            +-----------+
endIndex    |           |

*/

function nextIndex(current) {
    var check = current + 1;
    if (check >= maxMessageInQueue) {
        check = 0;
    }
    return check;
}

function prevIndex(current) {
    var check = current - 1;
    if (check < 0) {
        check = mexMessageInQueue - 1;
    }
    return check;
}

// add new message into queue
function addNew(message) {
    // queue is empty, just add to queue
    if (currentIndex == endIndex) {
        messageQueue[endIndex] = message;
        endIndex = nextIndex(endIndex);
        return;
    }
    // ignore the message if the index less than currentIndex
    if (message.index <= messageQueue[currentIndex].index) {
        // expires message, ignore
        return;
    }

    index = message.index %  maxMessageInQueue;
    while (index != endIndex) {
        messageQueue[endIndex] = null;
        endIndex = nextIndex(endIndex);

        // overlapped, move current to next
        if (endIndex == currentIndex) {
            currentIndex = nextIndex(currentIndex);
            currentOffset = 0;
        }
    }
    if (index == endIndex) {
        messageQueue[endIndex] = message;
        endIndex = nextIndex(endIndex);

        // overlapped, move current to next
        if (endIndex == currentIndex) {
            currentIndex = nextIndex(currentIndex);
            currentOffset = 0;
        }
        return;
    }
}

function getItem() {
    if (messageQueue[currentIndex].ecg.length > currentOffset) {
        var item = messageQueue[currentIndex].ecg[currentOffset];
        currentOffset ++;
        return item;
    } else {
        currentIndex = nextIndex(currentIndex);
        if (currentIndex == endIndex) {
            // no data
            return Number.NaN;
        }
        currentOffset = 0;
        return getItem();
    }   
}