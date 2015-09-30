    function DrawingCanvas(canvasElement) {
        var canvas = canvasElement;
        var context = canvasElement.getContext('2d');

        var gridColor = "#666666";    // background color
        var graphColor = "#00ff00";     // graph color
        var cursorColor = "#ffffff";    // cursor color

        // to fix graph in window, value need to be normalized:
        // factor change size, ofset change position
        // newValue = value * factor + offset
        var factor = 1;
        var offset = 0;
        var lastValues = [];

        // current point (x1, y1) previous point
        // (x2, y2) new point
        var x1 = 0, x2 = 0, y1 = 0, y2 = 0;

        /*
            clear area for new data
            start from the current position (x1) for width
        */
        function clearDrawArea(width) {
            context.save();
            context.rect(x1, 0, width + 20, canvas.height);
            context.clip();
            context.clearRect(x1, 0, width + 20, canvas.height);
            drawGrid();
            context.restore();
        }

        /*
            draw cursor at curent position (x1, y1)
        */
        function drawCursor() {
            context.beginPath();
            context.arc(x1 + 6, y1 - 3, 5, 0, 2 * Math.PI);
            context.fillStyle = cursorColor;
            context.fill();
            context.strokeStyle = cursorColor;
            context.lineWidth = 3;
            context.stroke();
        }

        function normalize(value) {
            var minValue, maxValue;
            lastValues.push(value);
            if (lastValues.length > 200) {
                lastValues = lastValues.slice(1);
            }
            minValue = maxValue = lastValues[0];
            for (i = 1; i < lastValues.length; i++) {
                if (lastValues[i] > maxValue)
                    maxValue = lastValues[i];
                if (lastValues[i] < minValue)
                    minValue = lastValues[i];
            }
            offset = -minValue;
            factor = canvas.height / (maxValue - minValue);

            var v = canvas.height - (value * factor + offset);
            return v;
        }

        function clearCanvas() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            x1 = -1;
            x2 = 0;
        }

        function drawGrid() {
            var i = 250;    // 1/4 sec
            context.save();
            context.beginPath();
            for (i = 0; i < canvas.width; i += 25) {
                context.moveTo(i, 0);
                context.lineTo(i, canvas.height);
            }
            context.strokeStyle = gridColor;
            context.lineWidth = 0.5;
            context.stroke();
            context.restore();
        }

        function drawData(values) {
            if (values.length <= 0)
                return;
            var index = 0;
            if (x1 == -1) {
                x1 = 0;
                y1 = normalize(values[index]);
                index ++;
                //clearCanvas();
            }
            clearDrawArea(values.length);
            context.beginPath();
            context.moveTo(x1, y1);

            while (index < values.length) {
                x2 = x1 + 1;
                y2 = normalize(values[index]);
                index ++;
                context.lineTo(x2, y2);
                x1 = x2;
                y1 = y2;
                if (x2 >= canvas.width) {
                    x1 = -1;
                    break;  // ignore other values,
                            // don't have to accurate at this point
                }
            }
            context.strokeStyle = graphColor;
            context.stroke();
            drawCursor();
        }
        return {
            clearCanvas : clearCanvas,
            drawData: drawData,
        }
    }