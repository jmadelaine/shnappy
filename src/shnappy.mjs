const prebuiltShapes = {
  ellipse: [
    [500, 0],
    [451, 2],
    [402, 10],
    [355, 22],
    [309, 38],
    [264, 59],
    [222, 84],
    [183, 113],
    [146, 146],
    [113, 183],
    [84, 222],
    [59, 264],
    [38, 309],
    [22, 355],
    [10, 402],
    [2, 451],
    [0, 500],
    [2, 549],
    [10, 598],
    [22, 645],
    [38, 691],
    [59, 736],
    [84, 778],
    [113, 817],
    [146, 854],
    [183, 887],
    [222, 916],
    [264, 941],
    [309, 962],
    [355, 978],
    [402, 990],
    [451, 998],
    [500, 1000],
    [549, 998],
    [598, 990],
    [645, 978],
    [691, 962],
    [736, 941],
    [778, 916],
    [817, 887],
    [854, 854],
    [887, 817],
    [916, 778],
    [941, 736],
    [962, 691],
    [978, 645],
    [990, 598],
    [998, 549],
    [1000, 500],
    [998, 451],
    [990, 402],
    [978, 355],
    [962, 309],
    [941, 264],
    [916, 222],
    [887, 183],
    [854, 146],
    [817, 113],
    [778, 84],
    [736, 59],
    [691, 38],
    [645, 22],
    [598, 10],
    [549, 2],
    [500, 0],
  ],
  rectangle: [
    [0, 1000],
    [0, 0],
    [1000, 0],
    [1000, 1000],
    [0, 1000],
  ],
}

const BOUNDS_SIZE = 1000

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

const getBoundingBox = coords => {
  var l = +Infinity,
    r = -Infinity,
    t = +Infinity,
    b = -Infinity
  for (const c of coords) {
    l = Math.min(l, c[0])
    t = Math.min(t, c[1])
    r = Math.max(r, c[0])
    b = Math.max(b, c[1])
  }
  return [
    [l, t],
    [r, b],
  ]
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

export const toShape = (coords = []) => {
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

const getSqrDistance = (c0, c1) => {
  const dx = c1[0] - c0[0]
  const dy = c1[1] - c0[1]
  return dx * dx + dy * dy
}

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

const resampleCoords = (path, sampleCount) => {
  const totalSqrLength = path.reduce((a, c, i) => (!i ? 0 : a + getSqrDistance(path[i - 1], c)), 0)

  const sqrSpacing = totalSqrLength / ((sampleCount - 1) * (sampleCount - 1))
  const resampledPath = [path[0]]
  let remainingSqrDistance = sqrSpacing
  let currentSegment = 0

  for (let i = 1; i < sampleCount - 1; i++) {
    const sqrDistance = getSqrDistance(path[currentSegment], path[currentSegment + 1])
    while (remainingSqrDistance > sqrDistance) {
      remainingSqrDistance -= sqrDistance
      currentSegment++
    }

    const t = remainingSqrDistance / sqrDistance
    resampledPath.push(lerp(path[currentSegment], path[currentSegment + 1], t))
    remainingSqrDistance = sqrSpacing
  }

  resampledPath.push(path[path.length - 1])
  return resampledPath
}

const transformAndScaleToMaxBounds = coords => {
  // non-uniform scale; assumes 2D gestures (i.e., no lines)
  var [[bbLeft, bbTop], [bbRight, bbBottom]] = getBoundingBox(coords)
  const bbWidth = bbRight - bbLeft
  const bbHeight = bbBottom - bbTop
  const scaledCoords = []
  for (const c of coords) {
    scaledCoords.push([c[0] * (BOUNDS_SIZE / bbWidth), c[1] * (BOUNDS_SIZE / bbHeight)])
  }
  return scaledCoords
}

const shapeReducer = (a, s) => {
  if (typeof s === 'string') {
    const prebuilt = prebuiltShapes[s]
    if (prebuilt) a[s] = resampleCoords(prebuilt)
    else throw new Error(`\"${s}\" is not a valid prebuilt.`)
  } else {
    // FIXME: allow custom shape definitions to be passed in as an object (or multiple objects)
    throw new Error('Not implemented.')
  }
  return a
}

export const shnappy = (shapes = []) => {
  shapes = shapes.reduce(shapeReducer, {})
  console.log(shapes)
}
