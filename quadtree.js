class Quadtree {
    constructor(boundary) {
        //Boundary: Ubicacion del centro y su ancho/largo, 
        //Capacity: Los nodos que soporta antes de dividirse,
        //Points:   Contiene la cantidad de puntos en este nodo
        this.boundary = boundary
        this.capacity = 4
        this.points = []

        //Inicializando los 4 nodos del quadtree
        this.nw = null
        this.ne = null
        this.sw = null
        this.se = null
    }

    insert(point) {

        //Si el punto ya es parte del nodo:
        //No hacer nada
        if (!this.boundary.contains(point)) return;

        //Si la cantidad de puntos que tiene el Quadtree es menor a la capacidad establecida:
        //Agregarlo al array de puntos
        if (this.points.length < this.capacity) {
            this.points.push(point)
            point.node = this
            return true
        }

        //Si ya se llegó a la capacidad del Quadtree, y aún no se divide, dividirlo
        if (!this.nw) this.subdivide();

        //Checar en que nodo corresponde el punto que se va a insertar
        if (this.nw.insert(point)) return true
        if (this.ne.insert(point)) return true
        if (this.sw.insert(point)) return true
        if (this.se.insert(point)) return true

        return false
    }

    subdivide() {
        //Divide el nodo actual en 4 partes iguales,
        //Reduciendo a la mitad el valor de ambos lados de nodo que se va a dividir.
        this.nw = new Quadtree(
            new Boundary({
                x: this.boundary.center.x - this.boundary.half.w * 0.5,
                y: this.boundary.center.y - this.boundary.half.h * 0.5
            }, {
                w: this.boundary.half.w * 0.5,
                h: this.boundary.half.h * 0.5
            }))
        this.nw.parent = this

        this.ne = new Quadtree(
            new Boundary({
                x: this.boundary.center.x + this.boundary.half.w * 0.5,
                y: this.boundary.center.y - this.boundary.half.h * 0.5
            }, {
                w: this.boundary.half.w * 0.5,
                h: this.boundary.half.h * 0.5
            }))
        this.ne.parent = this

        this.sw = new Quadtree(
            new Boundary({
                x: this.boundary.center.x - this.boundary.half.w * 0.5,
                y: this.boundary.center.y + this.boundary.half.h * 0.5
            }, {
                w: this.boundary.half.w * 0.5,
                h: this.boundary.half.h * 0.5
            }))
        this.sw.parent = this

        this.se = new Quadtree(
            new Boundary({
                x: this.boundary.center.x + this.boundary.half.w * 0.5,
                y: this.boundary.center.y + this.boundary.half.h * 0.5
            }, {
                w: this.boundary.half.w * 0.5,
                h: this.boundary.half.h * 0.5
            }))
        this.se.parent = this

        // Transferir los puntos del nodo actual a sus correspondientes subnodos   
        for (var i = 0; i < this.points.length; i++) {
            this.nw.insert(this.points[i])
            this.ne.insert(this.points[i])
            this.sw.insert(this.points[i])
            this.se.insert(this.points[i])
        }

        // Este nodo ahora es una rama, no contiene puntos, solo nodos.
        this.points = []
        this.capacity = 0

    }

    query(range, found) {

        //Si el área en cuestión no intersecta con el nodo que tiene debajo:
        //Regresar vacio
        if (!this.boundary.intersects(range)) return found

        //Si intersecta 
        for (var i = 0; i < this.points.length; i++) {
            if (range.contains(this.points[i])) {
                found.push(this.points[i])
            }
        }

        if (!this.nw) return found

        found.concat(this.nw.query(range, found))
        found.concat(this.ne.query(range, found))
        found.concat(this.sw.query(range, found))
        found.concat(this.se.query(range, found))

        return found
    }

    draw() {

        //Dibujar un cuadrado a partir del nodo
        context.clearRect(this.boundary.center.x - this.boundary.half.w,
            this.boundary.center.y - this.boundary.half.h,
            this.boundary.half.w * 2,
            this.boundary.half.h * 2)

        context.beginPath()
        context.rect(this.boundary.center.x - this.boundary.half.w,
            this.boundary.center.y - this.boundary.half.h,
            this.boundary.half.w * 2,
            this.boundary.half.h * 2)

        context.lineWidth = 1
        context.strokeStyle = 'rgb(0, 0, 0)'
        context.stroke()

        /*
        //Dibujar cantidad de puntos en este nodo
        context.beginPath()
        context.fillStyle = 'black'
        context.fillText(this.points.length, this.boundary.center.x, this.boundary.center.y)
        context.fill()*/

        //Dibujar todos los puntos en el array 'points' del nodo actual
        for (var i = 0; i < this.points.length; i++) {
            context.beginPath()
            context.arc(this.points[i].x, this.points[i].y, 1, 0, 2 * Math.PI, false)
            context.fill()
            context.lineWidth = 4
            if (range.contains(this.points[i])) {
                context.strokeStyle = 'green'
            } else {
                context.strokeStyle = 'rgb(0, 0, 0)'
            }
            context.stroke()

        }

        // Si el nodo actual no tiene subnodos, terminar
        if (!this.nw) return

        // Si tiene subnodos, dibujarlos
        this.nw.draw()
        this.ne.draw()
        this.sw.draw()
        this.se.draw()
    }


}