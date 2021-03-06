    function DrawingCanvas(canvasElement, pixelsPerSecond) {
        var canvas = canvasElement;
        var context = canvasElement.getContext('2d');

        var gridPrimaryColor = "#fc8c8c";    // background color
        var gridSecondaryColor = "#ffd9d9"
        var graphColor = "#0000ff";     // graph color
        var cursorColor = "#ff0000";    // cursor color

        // to fix graph in window, value need to be normalized:
        // yScale change size, yOffset change position
        var autoScale = true;
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

        function reset() {
            xScale = 1;
            yScale = 1;
            xOffset = 0;
            yOffset = 0; 
            minValue = maxValue = 0;
            lastValues = [];
            clearCanvas();
        }

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
            if (autoScale == true) {
                lastValues.push(value);

                var shift = null;
                var changed = false;

                if (lastValues.length > lastN) {
                    shift = lastValues[0];
                    lastValues = lastValues.slice(1);
                }

                // keep only lastN values
                if (value < minValue) {
                    minValue = value;
                    changed = true;
                } else if (value > maxValue) {
                    maxValue = value;
                    changed = true;
                } else if (shift != null) {
                    // need to re-calculate minValue/maxValue
                    // only if the value was shifted out
                    if (shift = minValue || shift == maxValue) {
                        changed = true;
                        minValue = maxValue = lastValues[0];
                        for (i = 1; i < lastValues.length; i++) {
                            if (lastValues[i] > maxValue)
                                maxValue = lastValues[i];
                            if (lastValues[i] < minValue)
                                minValue = lastValues[i];
                        }
                    }
                }
                if (changed) {
                    yScale = canvas.height * 0.6 / (maxValue - minValue);
                    // center
                    yOffset = (canvas.height - (maxValue - minValue) * yScale * userYScale) / 2;
                    yOffset += - minValue * yScale * userYScale;
                }
            }
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
            var i, center;
            context.save();
            context.beginPath();
            // vertical grid lines
            for (i = 0; i < canvas.width; i += pixelsPerSecond / 25) {
                context.moveTo(i, 0);
                context.lineTo(i, canvas.height);
            }
            // horizontal grid lines
            center = canvas.height / 2;
            for (i = 0; i < center; i += pixelsPerSecond / 25) {
                context.moveTo(0, center - i);
                context.lineTo(canvas.width, center - i);
                if (i != 0) {
                    context.moveTo(0, center + i);
                    context.lineTo(canvas.width, center + i);
                }
            }
            context.strokeStyle = gridSecondaryColor;
            context.lineWidth = 0.8;
            context.stroke();

            context.beginPath();
            for (i = 0; i < canvas.width; i += pixelsPerSecond / 5) {
                context.moveTo(i, 0);
                context.lineTo(i, canvas.height);
            }
            center = canvas.height / 2;
            for (i = 0; i < center; i += pixelsPerSecond / 5) {
                context.moveTo(0, center - i);
                context.lineTo(canvas.width, center - i);
                if (i != 0) {
                    context.moveTo(0, center + i);
                    context.lineTo(canvas.width, center + i);
                }
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
            var pixelsPerDataItem = 1;
            clearDrawArea(values.length * pixelsPerDataItem);
            context.beginPath();
            context.moveTo(x1, y1);

            while (index < values.length) {
                x2 = x1 + pixelsPerDataItem;
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
            if (autoScale) {
                drawInfo();
            }
        }

        function drawInfo() {
            var msgs = [
                "Max: " + maxValue.toFixed(2),
                "Min: " + minValue.toFixed(2),
                "xScale: " + xScale.toFixed(2),
                "yScale: " + yScale.toFixed(2),
                "xOffset: " + xOffset.toFixed(2),
                "yOffset: " + yOffset.toFixed(2),
                "userYOffset: " + userYOffset.toFixed(2),
                ];
            var i;
            var width = 0;
            var height = 10;
            var w;
            context.fillStyle = "black";
            context.font = "12px Arial";
            for (i = 0; i < msgs.length; i++) {
                w =  context.measureText(msgs[i]).width;
                if (w > width)
                    width = w;
            }
            context.clearRect(10, 10, width + 4, height * msgs.length);
            //context.fillStyle = 'rgba(255, 255, 0, 0.2)';
            //context.fillRect(10, 10, width + 4, height * msgs.length);
            context.fillStyle = "#000000";
            for (i = 0; i < msgs.length; i++) {
                context.fillText(msgs[i], 12, i * height + 20);
            }

            // draw grid unit
            var text = '0.2s';
            w = context.measureText(text);
            var x = pixelsPerSecond / 5 - (w.width / 2);
            var h = 15;
            context.clearRect(x, canvas.height - h, 25, h);
            //context.fillRect(x, y, 25, 30);
            //context.fillStyle = 'rgba(255, 255, 0)';
            context.fillText('0.2s', x, canvas.height - 3);
        }

        function setUserYScale(v) {
            userYScale = v;
        }

        function setUserYOffsetPercent(percent) {
            userYOffset = canvas.height * percent / 100;
        }

        function setAutoScale(v) {
            autoScale = v;
        }

        function getMax() {
            return {min: minValue, max:maxValue}
        }

        function setMax(value) {
            minValue = value.min;
            maxValue = value.max;
        }

        function setScale(scale) {
            xScale = scale.x;
            yScale = scale.y;
            console.log('scale: ' + xScale + ", " + yScale);
        }

        function getScale() {
            return {x: xScale, y:yScale}
        }

        function getOffset() {
            return {x: xOffset, y: yOffset};
        }

        function setOffset(offset) {
            xOffset = offset.x;
            yOffset = offset.y;
        }
        
        return {
            setGridColor: setGridColor,
            clearCanvas: clearCanvas,
            drawData: drawData,
            reset: reset,
            setUserYScale: setUserYScale,
            setUserYOffsetPercent: setUserYOffsetPercent,
            setAutoScale: setAutoScale,
            getMax: getMax,
            setMax: setMax,
            getScale: getScale,
            setScale: setScale,
            getOffset: getOffset,
            setOffset: setOffset,
        }
    }