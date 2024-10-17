//
// Point class
//
function Point(x, y) {
  // constructor
  this.X = x
  this.Y = y
}
//
// Rectangle class
//
function Rectangle(x, y, width, height) {
  // constructor
  this.X = x
  this.Y = y
  this.Width = width
  this.Height = height
}
//
// Unistroke class: a unistroke template
//
function Unistroke(name, points) {
  // constructor
  this.Name = name
  this.Points = Resample(points, NumPoints)
  var radians = IndicativeAngle(this.Points)
  this.Points = RotateBy(this.Points, -radians)
  this.Points = ScaleTo(this.Points, SquareSize)
  this.Points = TranslateTo(this.Points, Origin)
  this.Vector = Vectorize(this.Points) // for Protractor
}
//
// Result class
//
function Result(name, score, ms) {
  // constructor
  this.Name = name
  this.Score = score
  this.Time = ms
}
//
// DollarRecognizer constants
//
const NumUnistrokes = 16
const NumPoints = 64
const SquareSize = 250.0
const Origin = new Point(0, 0)
const Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize)
const HalfDiagonal = 0.5 * Diagonal
const AngleRange = Deg2Rad(45.0)
const AnglePrecision = Deg2Rad(2.0)
const Phi = 0.5 * (-1.0 + Math.sqrt(5.0)) // Golden Ratio
//
// DollarRecognizer class
//
function DollarRecognizer() {
  // constructor
  //
  // one built-in unistroke per gesture type
  //
  this.Unistrokes = [
    new Unistroke('rectangle', [
      new Point(78, 149),
      new Point(78, 153),
      new Point(78, 157),
      new Point(78, 160),
      new Point(79, 162),
      new Point(79, 164),
      new Point(79, 167),
      new Point(79, 169),
      new Point(79, 173),
      new Point(79, 178),
      new Point(79, 183),
      new Point(80, 189),
      new Point(80, 193),
      new Point(80, 198),
      new Point(80, 202),
      new Point(81, 208),
      new Point(81, 210),
      new Point(81, 216),
      new Point(82, 222),
      new Point(82, 224),
      new Point(82, 227),
      new Point(83, 229),
      new Point(83, 231),
      new Point(85, 230),
      new Point(88, 232),
      new Point(90, 233),
      new Point(92, 232),
      new Point(94, 233),
      new Point(99, 232),
      new Point(102, 233),
      new Point(106, 233),
      new Point(109, 234),
      new Point(117, 235),
      new Point(123, 236),
      new Point(126, 236),
      new Point(135, 237),
      new Point(142, 238),
      new Point(145, 238),
      new Point(152, 238),
      new Point(154, 239),
      new Point(165, 238),
      new Point(174, 237),
      new Point(179, 236),
      new Point(186, 235),
      new Point(191, 235),
      new Point(195, 233),
      new Point(197, 233),
      new Point(200, 233),
      new Point(201, 235),
      new Point(201, 233),
      new Point(199, 231),
      new Point(198, 226),
      new Point(198, 220),
      new Point(196, 207),
      new Point(195, 195),
      new Point(195, 181),
      new Point(195, 173),
      new Point(195, 163),
      new Point(194, 155),
      new Point(192, 145),
      new Point(192, 143),
      new Point(192, 138),
      new Point(191, 135),
      new Point(191, 133),
      new Point(191, 130),
      new Point(190, 128),
      new Point(188, 129),
      new Point(186, 129),
      new Point(181, 132),
      new Point(173, 131),
      new Point(162, 131),
      new Point(151, 132),
      new Point(149, 132),
      new Point(138, 132),
      new Point(136, 132),
      new Point(122, 131),
      new Point(120, 131),
      new Point(109, 130),
      new Point(107, 130),
      new Point(90, 132),
      new Point(81, 133),
      new Point(76, 133),
    ]),
    new Unistroke('circle', [
      new Point(127, 141),
      new Point(124, 140),
      new Point(120, 139),
      new Point(118, 139),
      new Point(116, 139),
      new Point(111, 140),
      new Point(109, 141),
      new Point(104, 144),
      new Point(100, 147),
      new Point(96, 152),
      new Point(93, 157),
      new Point(90, 163),
      new Point(87, 169),
      new Point(85, 175),
      new Point(83, 181),
      new Point(82, 190),
      new Point(82, 195),
      new Point(83, 200),
      new Point(84, 205),
      new Point(88, 213),
      new Point(91, 216),
      new Point(96, 219),
      new Point(103, 222),
      new Point(108, 224),
      new Point(111, 224),
      new Point(120, 224),
      new Point(133, 223),
      new Point(142, 222),
      new Point(152, 218),
      new Point(160, 214),
      new Point(167, 210),
      new Point(173, 204),
      new Point(178, 198),
      new Point(179, 196),
      new Point(182, 188),
      new Point(182, 177),
      new Point(178, 167),
      new Point(170, 150),
      new Point(163, 138),
      new Point(152, 130),
      new Point(143, 129),
      new Point(140, 131),
      new Point(129, 136),
      new Point(126, 139),
    ]),
    new Unistroke('arrow', [
      new Point(68, 222),
      new Point(70, 220),
      new Point(73, 218),
      new Point(75, 217),
      new Point(77, 215),
      new Point(80, 213),
      new Point(82, 212),
      new Point(84, 210),
      new Point(87, 209),
      new Point(89, 208),
      new Point(92, 206),
      new Point(95, 204),
      new Point(101, 201),
      new Point(106, 198),
      new Point(112, 194),
      new Point(118, 191),
      new Point(124, 187),
      new Point(127, 186),
      new Point(132, 183),
      new Point(138, 181),
      new Point(141, 180),
      new Point(146, 178),
      new Point(154, 173),
      new Point(159, 171),
      new Point(161, 170),
      new Point(166, 167),
      new Point(168, 167),
      new Point(171, 166),
      new Point(174, 164),
      new Point(177, 162),
      new Point(180, 160),
      new Point(182, 158),
      new Point(183, 156),
      new Point(181, 154),
      new Point(178, 153),
      new Point(171, 153),
      new Point(164, 153),
      new Point(160, 153),
      new Point(150, 154),
      new Point(147, 155),
      new Point(141, 157),
      new Point(137, 158),
      new Point(135, 158),
      new Point(137, 158),
      new Point(140, 157),
      new Point(143, 156),
      new Point(151, 154),
      new Point(160, 152),
      new Point(170, 149),
      new Point(179, 147),
      new Point(185, 145),
      new Point(192, 144),
      new Point(196, 144),
      new Point(198, 144),
      new Point(200, 144),
      new Point(201, 147),
      new Point(199, 149),
      new Point(194, 157),
      new Point(191, 160),
      new Point(186, 167),
      new Point(180, 176),
      new Point(177, 179),
      new Point(171, 187),
      new Point(169, 189),
      new Point(165, 194),
      new Point(164, 196),
    ]),
  ]

  //
  // The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
  //
  this.Recognize = function (points, useProtractor) {
    var t0 = Date.now()
    var candidate = new Unistroke('', points)

    var u = -1
    var b = +Infinity
    for (
      var i = 0;
      i < this.Unistrokes.length;
      i++ // for each unistroke template
    ) {
      var d
      if (useProtractor) d = OptimalCosineDistance(this.Unistrokes[i].Vector, candidate.Vector) // Protractor
      else d = DistanceAtBestAngle(candidate.Points, this.Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision) // Golden Section Search (original $1)
      if (d < b) {
        b = d // best (least) distance
        u = i // unistroke index
      }
    }
    var t1 = Date.now()
    return u == -1
      ? new Result('No match.', 0.0, t1 - t0)
      : new Result(this.Unistrokes[u].Name, useProtractor ? 1.0 - b : 1.0 - b / HalfDiagonal, t1 - t0)
  }
  this.AddGesture = function (name, points) {
    this.Unistrokes[this.Unistrokes.length] = new Unistroke(name, points) // append new unistroke
    var num = 0
    for (var i = 0; i < this.Unistrokes.length; i++) {
      if (this.Unistrokes[i].Name == name) num++
    }
    return num
  }
  this.DeleteUserGestures = function () {
    this.Unistrokes.length = NumUnistrokes // clear any beyond the original set
    return NumUnistrokes
  }
}
//
// Private helper functions from here on down
//
function Resample(points, n) {
  var I = PathLength(points) / (n - 1) // interval length
  var D = 0.0
  var newpoints = new Array(points[0])
  for (var i = 1; i < points.length; i++) {
    var d = getDistance(points[i - 1], points[i])
    if (D + d >= I) {
      var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X)
      var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y)
      var q = new Point(qx, qy)
      newpoints[newpoints.length] = q // append new point 'q'
      points.splice(i, 0, q) // insert 'q' at position i in points s.t. 'q' will be the next i
      D = 0.0
    } else D += d
  }
  if (newpoints.length == n - 1)
    // somtimes we fall a rounding-error short of adding the last point, so add it if so
    newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y)
  return newpoints
}
function IndicativeAngle(points) {
  var c = Centroid(points)
  return Math.atan2(c.Y - points[0].Y, c.X - points[0].X)
}
function RotateBy(points, radians) {
  // rotates points around centroid
  var c = Centroid(points)
  var cos = Math.cos(radians)
  var sin = Math.sin(radians)
  var newpoints = new Array()
  for (var i = 0; i < points.length; i++) {
    var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X
    var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y
    newpoints[newpoints.length] = new Point(qx, qy)
  }
  return newpoints
}
function ScaleTo(points, size) {
  // non-uniform scale; assumes 2D gestures (i.e., no lines)
  var B = BoundingBox(points)
  var newpoints = new Array()
  for (var i = 0; i < points.length; i++) {
    var qx = points[i].X * (size / B.Width)
    var qy = points[i].Y * (size / B.Height)
    newpoints[newpoints.length] = new Point(qx, qy)
  }
  return newpoints
}
function TranslateTo(points, pt) {
  // translates points' centroid
  var c = Centroid(points)
  var newpoints = new Array()
  for (var i = 0; i < points.length; i++) {
    var qx = points[i].X + pt.X - c.X
    var qy = points[i].Y + pt.Y - c.Y
    newpoints[newpoints.length] = new Point(qx, qy)
  }
  return newpoints
}
function Vectorize(points) {
  // for Protractor
  var sum = 0.0
  var vector = new Array()
  for (var i = 0; i < points.length; i++) {
    vector[vector.length] = points[i].X
    vector[vector.length] = points[i].Y
    sum += points[i].X * points[i].X + points[i].Y * points[i].Y
  }
  var magnitude = Math.sqrt(sum)
  for (var i = 0; i < vector.length; i++) vector[i] /= magnitude
  return vector
}
function OptimalCosineDistance(v1, v2) {
  // for Protractor
  var a = 0.0
  var b = 0.0
  for (var i = 0; i < v1.length; i += 2) {
    a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1]
    b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i]
  }
  var angle = Math.atan(b / a)
  return Math.acos(a * Math.cos(angle) + b * Math.sin(angle))
}
function DistanceAtBestAngle(points, T, a, b, threshold) {
  var x1 = Phi * a + (1.0 - Phi) * b
  var f1 = DistanceAtAngle(points, T, x1)
  var x2 = (1.0 - Phi) * a + Phi * b
  var f2 = DistanceAtAngle(points, T, x2)
  while (Math.abs(b - a) > threshold) {
    if (f1 < f2) {
      b = x2
      x2 = x1
      f2 = f1
      x1 = Phi * a + (1.0 - Phi) * b
      f1 = DistanceAtAngle(points, T, x1)
    } else {
      a = x1
      x1 = x2
      f1 = f2
      x2 = (1.0 - Phi) * a + Phi * b
      f2 = DistanceAtAngle(points, T, x2)
    }
  }
  return Math.min(f1, f2)
}
function DistanceAtAngle(points, T, radians) {
  var newpoints = RotateBy(points, radians)
  return PathDistance(newpoints, T.Points)
}
function Centroid(points) {
  var x = 0.0,
    y = 0.0
  for (var i = 0; i < points.length; i++) {
    x += points[i].X
    y += points[i].Y
  }
  x /= points.length
  y /= points.length
  return new Point(x, y)
}
function BoundingBox(points) {
  var minX = +Infinity,
    maxX = -Infinity,
    minY = +Infinity,
    maxY = -Infinity
  for (var i = 0; i < points.length; i++) {
    minX = Math.min(minX, points[i].X)
    minY = Math.min(minY, points[i].Y)
    maxX = Math.max(maxX, points[i].X)
    maxY = Math.max(maxY, points[i].Y)
  }
  return new Rectangle(minX, minY, maxX - minX, maxY - minY)
}
function PathDistance(pts1, pts2) {
  var d = 0.0
  for (
    var i = 0;
    i < pts1.length;
    i++ // assumes pts1.length == pts2.length
  )
    d += getDistance(pts1[i], pts2[i])
  return d / pts1.length
}
function PathLength(points) {
  var d = 0.0
  for (var i = 1; i < points.length; i++) d += getDistance(points[i - 1], points[i])
  return d
}
function getDistance(p1, p2) {
  var dx = p2.X - p1.X
  var dy = p2.Y - p1.Y
  return Math.sqrt(dx * dx + dy * dy)
}
function Deg2Rad(d) {
  return (d * Math.PI) / 180.0
}
