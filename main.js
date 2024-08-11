let formFile = document.getElementById("formFile");
let formImg = document.getElementById("formImg");
let imageCanvas = document.getElementById("img-canvas");
let procCanvas = document.getElementById("proc-canvas");

let ctx = imageCanvas.getContext("2d");
var image = new Image();
image.onload = function() {
    let divisor = 1.0;
    imageCanvas.width = image.width/divisor;
    imageCanvas.height = image.height/divisor;
    procCanvas.width = image.width/divisor;
    procCanvas.height = image.height/divisor;
    ctx.drawImage(image, 0, 0, imageCanvas.width, imageCanvas.height);
};
image.src = "/gradient-kit/bird.jpg";
formImg.src = "/gradient-kit/bird.jpg"
let defaultSet = true;

document.getElementById('save').addEventListener("click", function(e) {

    var dataURL = procCanvas.toDataURL("image/jpeg", 1.0);

    downloadImage(dataURL, 'untitled.jpg');
});

function downloadImage(data, filename = 'untitled.jpg') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}

formFile.addEventListener("change", (input) => {
    input = input.target;
    if (input.files && input.files[0]) {
        console.log(input.files[0]);
        
        var reader = new FileReader();

        reader.onload = function (e) {
            console.log(e.target.result);
            formImg.src =  e.target.result;
            
            var image = new Image();
            image.onload = function() {
                let maxWidth = 1000;
                let maxHeight = 1000;
                let a = image.width / maxWidth;
                let b = image.height / maxHeight;
                let divisor = 1;
                if (a < 1 && b < 1) {
                    divisor = 1;
                } else if (a > 1 && b > 1) {
                    let bigger = (a > b) ? a : b;
                    divisor = bigger;
                } else {
                    if (a > 1) {
                        divisor = a;
                    } else if (b > 1) {
                        divisor = b;
                    }

                }
                // divisor = (image.width * image.height > maxPixels) ? (image.width*image.height)/maxPixels : 1.0;
                imageCanvas.width = image.width/divisor;
                imageCanvas.height = image.height/divisor;
                procCanvas.width = image.width/divisor;
                procCanvas.height = image.height/divisor;
                ctx.drawImage(image, 0, 0, imageCanvas.width, imageCanvas.height);
            };
            image.src = e.target.result;
            
            // formImg.width = 300;
            // formImg.height = 250;
        };

        reader.readAsDataURL(input.files[0]);
    }
});

// 0.299 ∙ Red + 0.587 ∙ Green + 0.114 ∙ Blue
const toGrayscale = (r,g,b) => {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

let setToGray = true;

const processImage = () => {
    if (formFile.files[0] || defaultSet) {
        let context = imageCanvas.getContext("2d");
        const imgData = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
        const data = imgData.data;
        let newImgData = new ImageData(imgData.width, imgData.height);
        let newData = newImgData.data;
        // enumerate all pixels
        // each pixel's r,g,b,a datum are stored in separate sequential array elements
    
        for(let i = 0; i < data.length; i += 4) {
            if (setToGray) {
                let g = toGrayscale(data[i],data[i + 1],data[i + 2]);
                data[i] = data[i + 1] = data[i + 2] = g;
            }
            newData[i] = 255*getColorVal(data[i]/255,redLine.points);
            newData[i + 1] = 255*getColorVal(data[i + 1]/255, greenLine.points);
            newData[i + 2] = 255*getColorVal(data[i + 2]/255, blueLine.points);
            newData[i + 3] = data[i + 3];
        }
    
        let procContext = procCanvas.getContext("2d");
        procContext.clearRect(0,0,imageCanvas.width,imageCanvas.height);
    
        createImageBitmap(newImgData).then((bitmap)=>{
            procContext.drawImage(bitmap, 0, 0);
        })
    }
}
document.getElementById("trigger").addEventListener("click", processImage);


function getBase64FromImageUrl(url) {
    var img = new Image();

    img.setAttribute('crossOrigin', 'anonymous');

    img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width =this.width;
        canvas.height =this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
    };

    img.src = url;
}


let canvas1 = document.getElementById("canvas-1");
const ctx1 = canvas1.getContext("2d");

const canvas2 = document.getElementById("canvas-2");
const ctx2 = canvas2.getContext("2d");

let mousePos = {x:0,y:0};

const pointSize = 4;
const pointFillColor = "none";

const lineStrokeWidth = 2;

function drawRect(x, y, w, h, strokeColor, strokeWidth, fillColor) {
    ctx1.beginPath();
    ctx1.lineWidth = strokeWidth;
    ctx1.rect(x, y, w, h);

    ctx1.fillStyle = fillColor;
    ctx1.fill()
    
    ctx1.strokeStyle = strokeColor;
    ctx1.stroke();
}

function drawCircle(x, y, scale, circleStrokeColor, strokeWidth, fillColor) {
    ctx1.beginPath();
    ctx1.arc(x, y, scale, 0, 2 * Math.PI);
    if (fillColor != "none") {
        ctx1.fillStyle = fillColor;
        ctx1.fill();
    } 
    ctx1.lineWidth = strokeWidth;
    ctx1.strokeStyle = circleStrokeColor;
    ctx1.stroke();
}

function drawLineBetween(x1,y1,x2,y2, strokeColor, strokeWidth) {
    ctx1.moveTo(x1, y1);
    ctx1.lineTo(x2, y2);
    
    ctx1.strokeStyle = strokeColor;
    ctx1.lineWidth = strokeWidth;
    ctx1.stroke();
}

function boundVal(val, min, max) {
    if (val < min) val = min;
    if (val > max) val = max;
    return val;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    let x = evt.clientX - rect.left;
    let y = evt.clientY - rect.top;
    x = boundVal(x, 0.0, canvas.width);
    y = boundVal(y, 0.0, canvas.height);

    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function circleCollision(p1x, p1y, r1, p2x, p2y, r2) {
    var a;
    var x;
    var y;

    a = r1 + r2;
    x = p1x - p2x;
    y = p1y - p2y;

    if (a > Math.sqrt((x * x) + (y * y))) {
        return true;
    } else {
        return false;
    }
}

function Point(x,y, color, strokeWidth, fillColor) {
    this.x = x;
    this.y = y;
    this.px = () => this.x/canvas1.width;
    this.py = () => (canvas1.height-this.y)/canvas1.height;
    this.color = color;
    this.strokeWidth = strokeWidth;
    this.fillColor = fillColor;
    this.render = function() {
        drawCircle(this.x,this.y,pointSize,this.color,this.strokeWidth,this.fillColor);
    }
}

function Line(colorChannel) {
    if (!CSS.supports('color',colorChannel)) console.error("unsupported color");
    this.colorChannel = colorChannel;
    this.points = [];
    this.addPoint = function(x,y) {
        this.points.push(new Point(x,y,"white", 3, this.colorChannel));
        this.points.sort((a,b) =>  (a.x < b.x) ? -1 : 1);
    }
    this.sortPoints = function() {
        this.points.sort((a,b) =>  (a.x < b.x) ? -1 : 1);
    }
    this.render = function() {
        ctx1.fillStyle = this.colorChannel;
        ctx1.strokeColor = this.colorChannel;
        if (this.points.length > 1) {
            for (let i = 0; i < this.points.length - 1; i++) {
                drawLineBetween(this.points[i].x, this.points[i].y, this.points[i+1].x, this.points[i+1].y, this.colorChannel, lineStrokeWidth);
            }
        }
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].render();
        }
    }
    
    this.checkCol = function(returnIdx) {
        for (let i = 0; i < this.points.length; i++) {
            if (circleCollision(this.points[i].x,this.points[i].y,2,mousePos.x,mousePos.y,5)) {
                return (returnIdx) ? [this.points[i], i] : this.points[i]; 
            }
        } 
        return (returnIdx) ? [false, false] : false;
    }

}

function imageDataToImage(imageData, canvas, ctx) {

    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);

    var image = new Image();
    image.src = canvas.toDataURL();
    ctx.drawImage(image,0,0);
}

const interpolate = function(prct,x1,y1,x2,y2) {
        
    let m = (y2-y1)/(x2-x1);
    let b = y1;
    return (m*(prct-x1))+b
}
const getColorVal = function(prct, points, debug) {
    if (points.length > 1) {
        if (prct <= points[0].px()) return points[0].py();
        for (let i = 0; i < points.length - 1; i++) {
            if (prct > points[i].px() && prct < points[i+1].px()) {
                if (debug) console.log(prct, points[i].px());
                return interpolate(prct, points[i].px(), points[i].py(), points[i+1].px(), points[i+1].py());
            }
        }
        return points[points.length-1].py();
    }
}

function Gradient(canvas) {
    if (canvas) this.canvas = canvas
    this.interpolate = function(prct,x1,y1,x2,y2) {
        
        let m = (y2-y1)/(x2-x1);
        let b = y1;
        return (m*(prct-x1))+b
    }
    this.getColorVal = function(prct, points, debug) {
        if (points.length > 1) {
            if (prct < points[0].px()) return points[0].py();
            for (let i = 0; i < points.length - 1; i++) {
                if (prct >= points[i].px() && prct <= points[i+1].px()) {
                    if (debug) console.log(prct, points[i].px());
                    return this.interpolate(prct, points[i].px(), points[i].py(), points[i+1].px(), points[i+1].py());
                }
            }
            return points[points.length-1].py();
        }
    }
    this.render = function(width, height, scale, redPoints, greenPoints, bluePoints) {
        try {

            let ctx = this.canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let imageData = ctx.createImageData(width, height);

            let line = Array(width*4);
            for (let i = 0; i < width*4; i += 4) {
                let prct = i/(width*4);
                line[i] = 255*this.getColorVal(prct,redPoints); // red
                line[i + 1] = 255*this.getColorVal(prct,greenPoints); // green
                line[i + 2] = 255*this.getColorVal(prct,bluePoints); // blue
                line[i + 3] = 255;
            }
            let copyData = (Array(height).fill(line).flat(Infinity));
            for (let j = 0; j < imageData.data.length; j++) {
                imageData.data[j] = copyData[j];
            }
            createImageBitmap(imageData).then((bitmap)=>{
                ctx.drawImage(bitmap, 0,0,this.canvas.width,this.canvas.height);
            })
            //ctx.putImageData(imageData, 0, 0);
            // imageDataToImage(data, this.canvas, ctx);
            
        } catch (e) {
            console.error(e);
        }
    }
    this.debug = function(prct, redPoints, greenPoints, bluePoints, debug) {
        prct = prct/canvas1.width;
        let r = 255*this.getColorVal(prct, redPoints);
        let g = 255*this.getColorVal(prct, greenPoints);
        let b = 255*this.getColorVal(prct, bluePoints);
        document.getElementById("color-debug").style.backgroundColor = `rgb(${r},${g},${b})`;

        if (debug) console.log(`
            prct: ${prct},
            r: ${r},
            g: ${g},
            b: ${b}
        `);
    }
}

let g = new Gradient(canvas2);
let gDebug = new Gradient();
let redLine = new Line("red");
let greenLine = new Line("green");
let blueLine = new Line("blue");

function reset() {
    redLine.points = [];
    redLine.addPoint(-1,(canvas1.height-5));
    redLine.addPoint(canvas1.width-1, (canvas1.height/5));
    greenLine.points = [];
    greenLine.addPoint(-1,canvas1.height-10);
    greenLine.addPoint(canvas1.width-1, (canvas1.height/3)); 
    blueLine.points = [];
    blueLine.addPoint(-1,canvas1.height/2);
    blueLine.addPoint(canvas1.width-1, canvas1.height/2);
    g.render(canvas1.width,canvas1.height,1,redLine.points,greenLine.points,blueLine.points);
    
}
document.getElementById("reset").addEventListener("click", reset);
reset();

let selectedLine = 0;

document.body.onload = function start() {
    processImage();
    document.getElementById("red-key").addEventListener("click", (e)=>selectedLine=0);
    document.getElementById("green-key").addEventListener("click", (e)=>selectedLine=1);
    document.getElementById("blue-key").addEventListener("click", (e)=>selectedLine=2);

    update();
}
  
function update() {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    greenLine.render();
    redLine.render();
    blueLine.render();
    //drawCircle(mousePos.x,mousePos.y,2,"black","1","black");
    requestAnimationFrame(update);
}

function pY(y) {
    return (canvas1.height-y)/canvas1.height;
}

function pX(x) {
    return x/canvas1.width;
}

function checkCol() {
    
    let redPoint = redLine.checkCol(false);
    let greenPoint = greenLine.checkCol(false);
    let bluePoint = blueLine.checkCol(false);
    // (canvas1.height-y)/canvas1.height;
    let point;
    let line;
    if (redPoint) { point = redPoint; line = redLine; }
    if (greenPoint) { point = greenPoint; line = greenLine; }
    if (bluePoint) { point = bluePoint; line = blueLine; }
    if (point && line) {
        console.log(`point: ${pX(point.x)}x ${pY(point.y)}y`);
        console.log(`r/g/b: ${255*getColorVal(pX(point.x),line.points, false)}`);
    }

    if (redPoint) return redLine.colorChannel;
    if (greenPoint) return greenLine.colorChannel;
    if (bluePoint) return blueLine.colorChannel;
    return undefined;
}

function checkColGetLine() {

    let [redPoint, ridx] = redLine.checkCol(true);
    let [greenPoint, gidx] = greenLine.checkCol(true);
    let [bluePoint, bidx] = blueLine.checkCol(true);

    if (redPoint) return [redPoint, ridx, redLine];
    if (greenPoint) return [greenPoint, gidx, greenLine];
    if (bluePoint) return [bluePoint, bidx, blueLine];
    return [undefined, undefined, undefined];
}

let clicked = false;
let mousedownID = -1;
let draggingPoint = false;
let startX = 0;
let startY = 0;
let pointClicked = undefined;
let pointsClicked = undefined;
let lineRefClicked = undefined;

canvas1.addEventListener("mousedown",  (e) => {

    if(mousedownID==-1) {
        mousedownID = 1;
        //mousedownID = setInterval(handleClick(e), 50 /*execute every 50ms*/);
    }
    let point = checkCol();
    if (point) {
        draggingPoint = true;
        switch (point) {
            case "red":
                selectedLine = 0;
                document.getElementById("red-key").click();
                break;
            case "green":
                selectedLine = 1;
                document.getElementById("green-key").click();
                break;
            case "blue":
                selectedLine = 2;
                document.getElementById("blue-key").click();
                break;
        }
    } else {
        switch (selectedLine) {
            case 0:
                ctx1.strokeColor = "red";
                redLine.addPoint(mousePos.x,mousePos.y);
                break;
            case 1:
                ctx1.strokeColor = "green";
                greenLine.addPoint(mousePos.x,mousePos.y);
                break;
            case 2:
                ctx1.strokeColor = "blue";
                blueLine.addPoint(mousePos.x,mousePos.y);
                break;
            default:
                console.error("invalid line");
                break;
        }
    }
    
    // g.render(400, 300, 1, redLine.points, greenLine.points, blueLine.points);
    g.render(canvas1.width,canvas1.height,1,redLine.points,greenLine.points,blueLine.points);

})
canvas1.addEventListener("mouseup", (e) => {
    if (draggingPoint) {
        draggingPoint = false;
    }
    // pointClicked = undefined;
    if(mousedownID!=-1) {  //Only stop if exists
        clearInterval(mousedownID);
        mousedownID=-1;
        clicked = false;
        if (pointClicked) pointClicked.color = "white";
        if (lineRefClicked) lineRefClicked.sortPoints();
        lineRefClicked = undefined;
        pointClicked = undefined;
        pointsClicked = undefined;

    }
})

const distance = (x1,y1,x2,y2) => {
    return Math.sqrt(Math.pow(Math.abs(y2-y1),2) + Math.pow(Math.abs(x2-x1),2));
}
let distanceDragged = 0;

canvas1.addEventListener("mousemove", (e) => {
    
    mousePos = getMousePos(canvas1, e); // TODO fix bounding allowing for dragging while cursor falls out of canvas box
    // if (!clicked) {
    //    return
    // }
    if(draggingPoint) { //&& mousedownID

        mousedownID = setInterval(handleDrag(e), 20);
    }

    gDebug.debug(mousePos.x,redLine.points,greenLine.points,blueLine.points, false);
 
})

canvas1.addEventListener("mouseleave", (e) => {

})


function handleDrag(e) {
    let [checkColPoint, checkIdx, line] = checkColGetLine();

    if (checkColPoint || pointClicked) {
        if (line) {
            let points = line.points;
            lineRefClicked = line;
            if (checkColPoint && !pointClicked) pointClicked = checkColPoint;
            if (points && !pointClicked) pointsClicked = points;
        }
        // console.log(pointClicked.x, pointClicked.y);
        if (mousedownID) {
            distanceDragged = distance(startX, startY, mousePos.x, mousePos.y);
            if (pointClicked.x > 0 && pointClicked.x < canvas1.width) pointClicked.x = mousePos.x;
            // if (checkIdx + 1 < points.length && pointClicked.x > points[checkIdx+1].x) pointClicked = points[checkIdx+1];
            // if (checkIdx - 1 > 0 && pointClicked.x < points[checkIdx-1].x) pointClicked = points[checkIdx-1];
            
            pointClicked.y = mousePos.y;
            pointClicked.x = (pointClicked.x > canvas1.width) ? canvas1.width : (pointClicked.x < 0) ? 0 : pointClicked.x;
            pointClicked.y = (pointClicked.y > canvas1.height) ? canvas1.height : (pointClicked.y < 0) ? 0 : pointClicked.y;
            pointClicked.color = "grey";
        } 
    }

    if (distanceDragged > 5) {
        //distanceDragged = 0;
        startX = mousePos.x;
        startY = mousePos.y;
        try {
            // g.render(400, 300, 1, redLine.points, greenLine.points, blueLine.points);
            g.render(canvas1.width,canvas1.height,1,redLine.points,greenLine.points,blueLine.points);

        } catch (e) {
            console.error(e);
        }
    }
}

function handleMouseMove(e) {
    mousePos = getMousePos(canvas1, e);
}

window.addEventListener('mousemove', handleMouseMove, false);
