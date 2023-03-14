const coordsToVector = (c0, c1) => [c1[0] - c0[0], c1[1] - c0[1]]
const getSqrMag = v => v[0] * v[0] + v[1] * v[1]
const getDotPdt = (v0, v1) => v0[0] * v1[0] + v0[1] * v1[1]
const interpolateVector = (v, t) => [v[0] * t, v[1] * t]

const getSqrMagFromCoordToLine = (l0, l1, c) => {
  const v = coordsToVector(l0, l1)
  const sm = getSqrMag(v)
  const dot = getDotPdt(v, coordsToVector(l0, c))
  const interpolation = dot / sm
  const iv = interpolateVector(v, interpolation)
  const intersect = [l0[0] + iv[0], l0[1] + iv[1]]
  return getSqrMag(coordsToVector(c, intersect))
}

const getBoundingBox = (coords = []) => {
  const tl = [undefined, undefined]
  const br = [undefined, undefined]
  for (const c of coords) {
    if (tl[0] === undefined || c[0] < tl[0]) tl[0] = c[0]
    if (tl[1] === undefined || c[1] < tl[1]) tl[1] = c[1]
    if (br[0] === undefined || c[0] > br[0]) br[0] = c[0]
    if (br[1] === undefined || c[1] > br[1]) br[1] = c[1]
  }
  if (tl.includes(undefined) || br.includes(undefined)) return undefined
  return [tl, br]
}

export const coordsToRect = (c0, c1) => [
  [c0[0], c0[1]],
  [c1[0], c0[1]],
  [c1[0], c1[1]],
  [c0[0], c1[1]],
]

const cornersToSides = (...corners) => {
  if (corners.length < 2) return undefined
  return corners.map((c, i, arr) => (i === 0 ? [arr[arr.length - 1], c] : [arr[i - 1], c]))
}

const tryCoordsToLine = coords => {
  if (coords.length < 2) return undefined
  const [l0] = coords
  const [l1] = coords.slice(-1)
  // Max distance from would-be line is determined by line length (or rather, sqr mag).
  const maxSqrMagDelta = getSqrMag(coordsToVector(l0, l1)) * 0.005
  if (coords.every(c => getSqrMagFromCoordToLine(l0, l1, c) <= maxSqrMagDelta)) return [l0, l1]
  return undefined
}

const tryCoordsToRect = coords => {
  if (coords.length < 4) return undefined
  const boundingBox = getBoundingBox(coords)
  const sides = cornersToSides(...coordsToRect(...boundingBox))
  // Max distance from would-be rect is determined by bounding box hypotenuse length (or rather, sqr mag).
  const maxSqrMagDelta = getSqrMag(coordsToVector(...boundingBox)) * 0.025
  const sqrMagFromFirstToLastCoord = getSqrMag(coordsToVector(coords[0], coords[coords.length - 1]))
  if (
    // Only counts as a rect if final coordinate is proximal to first coordinate
    // We allow for greater delta (x4) between first and last coord, than we do for other coords
    // promximity to bounding box, as this allows people less accuracy when 'completing' the rect.
    sqrMagFromFirstToLastCoord < maxSqrMagDelta * 4 &&
    coords.every(c => {
      return sides.some(([s0, s1]) => getSqrMagFromCoordToLine(s0, s1, c) <= maxSqrMagDelta)
    })
  ) {
    return boundingBox
  }
  return undefined
}

const toShape = (coords = []) => {
  const start = performance.now()
  if (!coords.length) return { type: 'freehand', coords }

  const lineCoords = tryCoordsToLine(coords)
  if (lineCoords) return { type: 'line', coords: lineCoords }

  const rectCoords = tryCoordsToRect(coords)
  const end = performance.now()
  console.log(end - start)
  if (rectCoords) return { type: 'rect', coords: rectCoords }

  return { type: 'freehand', coords }
}

export default toShape

// TODO: is chungus
