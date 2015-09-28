    function DrawingCanvas(canvasElement) {
        var canvas = canvasElement;
        var context = canvasElement.getContext('2d');
        var canvasColor = "#666666";
        var graphColor = "#00ff00";
        var cursorColor = "#ffffff";
        var x1 = 0, x2 = 0, y1 = 0, y2 = 0;

        function clearDrawArea(x, y) {
            context.fillStyle = canvasColor;
            context.fillRect(x, 0, 20, canvas.height);
            context.fill();

            context.beginPath();
            context.rect(x + 5, y - 5, 5, 5);
            context.fillStyle = cursorColor;
            context.fill();
            context.strokeStyle = cursorColor;
            context.lineWidth = 1;
            context.stroke();
        }

        return {
            clearCanvas : function() {
                context.fillStyle = canvasColor;
                context.fillRect(0, 0, canvas.width, canvas.height);
                x1 = 0;
                x2 = 0;
            },

            drawData: function(value) {
                x2 = x1 + 1;
                y2 = canvas.height - (value + 25000) / 200;
                if (x1 != -1) {
                    clearDrawArea(x1, y2);
                    context.beginPath();
                    context.moveTo(x1, y1);
                    context.lineTo(x2, y2);
                    context.strokeStyle = graphColor;
                    context.stroke();
                }
                x1 = x2;
                y1 = y2;
                if (x2 >= canvas.width) {
                    x1 = -1;
                }
            }
        }
    }