export class Vector {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  length () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  lengthSquare () {
    return this.x * this.x + this.y * this.y
  }

  normalize () {
    const length = this.length()

    return new Vector(this.x / length, this.y / length)
  }

  normal () {
    return (new Vector(-this.y, this.x)).normalize()
  }

  dot (vector) {
    return Math.round(this.x * vector.x + this.y * vector.y)
  }

  equals (vector) {
    return (this.x === vector.x && this.y === vector.y)
  }
}

export class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
}

export class Edge {
  constructor (p1, p2) {
    this.p1 = p1
    this.p2 = p2
    this.dx = p1.x - p2.x
    this.dy = p1.y - p2.y
  }

  length () {
    return Math.sqrt(this.dx * this.dx + this.dy * this.dy)
  }

  lengthSquare () {
    return (this.dx * this.dx + this.dy * this.dy)
  }

  normalize () {
    var length = this.length()

    return new Vector(this.dx / length, this.dy / length)
  }

  normal () {
    return (new Vector(-this.dy, this.dx)).normalize()
  }
}
