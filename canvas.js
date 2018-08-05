const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.addEventListener("mousedown", addPoint, false);
canvas.addEventListener("mousemove", getPosition, false);

function getPosition(event) {

    mouseX = event.x - canvas.offsetLeft;
    mouseY = event.y - canvas.offsetTop;

    //console.clear();
    //console.log("Hay " + qt.query(range, []).length + " puntos en el área verde.")

}

function addPoint(event) {

    let x = event.x - canvas.offsetLeft;
    let y = event.y - canvas.offsetTop;

    p = new Point(x, y)
    qt.insert(p)

}

let mouseX = 0;
let mouseY = 0;

let range;

let qt = new Quadtree(
    new Boundary({
        x: canvas.width / 2,
        y: canvas.height / 2
    }, {
        w: canvas.width / 2,
        h: canvas.height / 2
    }))

/*
for (let i = 0; i < 300; i++) {
    p = new Point(Math.random() * canvas.width, Math.random() * canvas.height)
    qt.insert(p) 
}*/

function show() {
    requestAnimationFrame(show)
    range = new Boundary({
        x: mouseX,
        y: mouseY
    }, {
        w: 25,
        h: 25
    })

    qt.draw()
    // Rango
    context.save()
    context.strokeStyle = 'green'
    context.strokeRect(range.center.x - range.half.w,
        range.center.y - range.half.h,
        range.half.w * 2,
        range.half.h * 2)
    context.restore()

    context.beginPath()
    context.fillStyle = 'black'
    context.fillText(qt.query(range, []).length, range.center.x, range.center.y)
    context.fill()
    context.closePath()

}

show()