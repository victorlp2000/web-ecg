    function DrawingCanvas(canvasElement) {
        var canvas = canvasElement;
        var context = canvasElement.getContext('2d');

        var gridPrimaryColor = "#fc8c8c";    // background color
        var gridSecondaryColor = "#ffd9d9"
        var graphColor = "#0000ff";     // graph color
        var cursorColor = "#ff0000";    // cursor color

        // to fix graph in window, value need to be normalized:
        // yScale change size, yOffset change position
        var xScale = 1;
        var yScale = 1;         // dynamically changing based on maxValue/minValue
        var xOffset = 0;
        var yOffset = 0;        // dynamically changing based on positive/negtive values
        var userXScale = 1;     // user specified yScale, apply over system yScale
        var userYScale = 1;
        var userXOffset = 0;     // user specified yScale, apply over system yScale
        var userYOffset = 0;
        var lastN = 2000;
        var minValue = 0, maxValue = 0;
        var lastValues = [];    // keep lastN values for calculating yScale and yOffset

        // current point (x1, y1) previous point
        // (x2, y2) new point
        var x1 = 0, x2 = 0, y1 = 0, y2 = 0;

        function setGridColor(primary, secondary) {
            gridPrimaryColor = primary;
            gridSecondaryColor = secondary;
        }

        /*
            clear area for new data
            start from the current position (x1) for width
        */
        function clearDrawArea(width) {
            var delta = 2;
            context.save();
            context.rect(x1, 0, width + delta, canvas.height);
            context.clip();
            context.clearRect(x1, 0, width + delta, canvas.height);
            drawGrid();
            context.restore();

            var grd = context.createLinearGradient(x1,0,x1 + 70,0);
            grd.addColorStop(0, '#ffffff');
            grd.addColorStop(1, 'rgba(255, 255, 255, 0)');
            context.fillStyle = grd; //'rgba(255, 255, 255, 0.3)';
            context.fillRect(x1 + width + delta, 0, 50, canvas.height);
        }

        /*
            draw cursor at curent position (x1, y1)
        */
        function drawCursor() {
            var r = 4;
            context.save();
            context.beginPath();
            context.arc(x1 + r + 1, y1, r, 0, 2 * Math.PI);
            context.fillStyle = graphColor; //cursorColor;
            context.fill();
            context.strokeStyle = graphColor; //cursorColor;
            context.lineWidth = 2;
            context.stroke();
            context.restore();
        }

        function normalize(value) {
            lastValues.push(value);

            var shift = null;

            if (lastValues.length > lastN) {
                shift = lastValues[0];
                lastValues = lastValues.slice(1);
            }

            // keep only lastN values
            if (value < minValue) {
                minValue = value;
            } else if (value > maxValue) {
                maxValue = value;
            } else if (shift != null) {
                // need to re-calculate minValue/maxValue
                // only if the value was shifted out
                if (shift = minValue || shift == maxValue) {
                    console.log("re-calculate...");
                    minValue = maxValue = lastValues[0];
                    for (i = 1; i < lastValues.length; i++) {
                        if (lastValues[i] > maxValue)
                            maxValue = lastValues[i];
                        if (lastValues[i] < minValue)
                            minValue = lastValues[i];
                    }
                }
            }
            // top/botom margin: 40%
            yScale = canvas.height * 0.6 / (maxValue - minValue);
            yOffset = -minValue + canvas.height * 0.2; // bottom 20%

            var v = canvas.height - (value * yScale  * userYScale + yOffset + userYOffset);
            return v;
        }

        function clearCanvas() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            x1 = -1;
            x2 = 0;
        }

        function drawGrid() {
            var pixelsPerSecond = 1000 / 5 * xScale;
            context.save();
            context.beginPath();
            for (i = 0; i < canvas.width; i += pixelsPerSecond / 20) {
                context.moveTo(i, 0);
                context.lineTo(i, canvas.height);
            }
            for (i = 0; i < canvas.height; i += pixelsPerSecond / 20) {
                context.moveTo(0, i);
                context.lineTo(canvas.width, i);
            }
            context.strokeStyle = gridSecondaryColor;
            context.lineWidth = 0.8;
            context.stroke();
            context.beginPath();
            for (i = 0; i < canvas.width; i += pixelsPerSecond / 2) {
                context.moveTo(i, 0);
                context.lineTo(i, canvas.height);
            }
            for (i = 0; i < canvas.height; i += pixelsPerSecond / 2) {
                context.moveTo(0, i);
                context.lineTo(canvas.width, i);
            }
            context.strokeStyle = gridPrimaryColor;
            context.lineWidth = 0.8;
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
            context.lineWidth = 2;
            context.stroke();
            drawCursor();
        }
        return {
            setGridColor: setGridColor,
            clearCanvas: clearCanvas,
            drawData: drawData,
        }
    }