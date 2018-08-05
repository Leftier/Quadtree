class Point {
    //Clase para mantener coordenadas
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}

class Boundary {
    //Clase para mantener un AABB (Axis-Aligned Bounding Box)
    constructor(center, half) {
        this.center = center;
        this.half = half;
    }

    //Geometria
    contains(point) {
        return (point.x >= this.center.x - this.half.w &&
            point.y >= this.center.y - this.half.h &&
            point.x < this.center.x + this.half.w &&
            point.y < this.center.y + this.half.h);
    }

    intersects(aabb) {
        return (Math.abs(this.center.x - aabb.center.x) * 2 < (this.half.w * 2 + aabb.half.w * 2)) &&
            (Math.abs(this.center.y - aabb.center.y) * 2 < (this.half.h * 2 + aabb.half.h * 2))
    }
}