import * as math from './math.js'

export function circleVSCircle (circle1, circle2) {
  const distance = (
    new math.Vector(
      circle2.center.x - circle1.center.x,
      circle2.center.y - circle1.center.y
    )
  ).lengthSquare()

  const minDistance = (circle1.radius + circle2.radius) *
    (circle1.radius + circle2.radius)

  return distance < minDistance
}

export function circleVSAABB () {
  return false
}

export function circleVSOBB () {
  return false
}

export function circleVSKDop () {
  return false
}

export function circleVSPoint () {
  return false
}

export function AABBVSCircle () {
  return false
}

export function AABBVSAABB () {
  return false
}

export function AABBVSOBB () {
  return false
}

export function AABBVSKDop () {
  return false
}

export function AABBVSPoint () {
  return false
}

export function OBBVSCircle () {
  return false
}

export function OBBVSAABB () {
  return false
}

export function OBBVSOBB () {
  return false
}

export function OBBVSKDop () {
  return false
}

export function OBBVSPoint () {
  return false
}

export function KDopVSCircle () {
  return false
}

export function KDopVSAABB () {
  return false
}

export function KDopVSOBB () {
  return false
}

export function KDopVSKDop () {
  return false
}

export function KDopVSPoint () {
  return false
}

export function PointVSCircle () {
  return false
}

export function PointVSAABB () {
  return false
}

export function PointVSOBB () {
  return false
}

export function PointVSKDop () {
  return false
}

export function PointVSPoint () {
  return false
}

export function circleVSEdge () {
  return false
}

export function edgeVSCircle () {
  return false
}
