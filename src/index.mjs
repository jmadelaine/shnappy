import shnappy from './shnappy.mjs'

/*
 * Init
 */

const cvs = document.getElementById('cvs')
if (!(cvs instanceof HTMLCanvasElement)) throw Error('Error getting canvas.')

cvs.width = cvs.height = 800

const ctx = cvs.getContext('2d')
if (!ctx) throw new Error('Error getting canvas context.')

ctx.strokeStyle = 'white'
ctx.lineWidth = 1

/*
 * State
 */

let isDrawing = false
let shape = []

/*
 * Events
 */

const createCoordFromEvent = e => {
  if (!(e instanceof MouseEvent)) throw new Error('Not a MouseEvent.')
  return [e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop]
}

const onStart = e => {
  if (!(e instanceof MouseEvent)) return
  isDrawing = true
  const coord = createCoordFromEvent(e)
  shape = []
  shape.push(coord)
  ctx.beginPath()
  ctx.moveTo(...coord)
}

const onMove = e => {
  if (!isDrawing) return
  if (!(e instanceof MouseEvent)) throw new Error('Not a MouseEvent.')
  const coord = createCoordFromEvent(e)
  shape.push(coord)
  ctx.lineTo(...coord)
  ctx.stroke()
}

const onStop = () => {
  isDrawing = false
  ctx.closePath()

  const shnapped = shnappy(shape)
  if (shnapped.type === 'freehand') return

  const oldColor = ctx.strokeStyle
  ctx.strokeStyle = '#f61d00'

  if (shnapped.type === 'line') {
    ctx.beginPath()
    for (let i = 0; i < shnapped.coords.length; i++) {
      const coord = shnapped.coords[i]
      if (!i) ctx.moveTo(...coord)
      else {
        ctx.lineTo(...coord)
        ctx.stroke()
      }
    }
    ctx.closePath()
  }

  if (shnapped.type === 'rect') {
    const [x, y] = shnapped.coords[0]
    const [w, h] = [shnapped.coords[1][0] - x, shnapped.coords[1][1] - y]
    ctx.strokeRect(x, y, w, h)
  }

  ctx.strokeStyle = oldColor
}

cvs.addEventListener('mousedown', onStart)
cvs.addEventListener('mouseup', onStop)
cvs.addEventListener('mousemove', onMove)

document.body.addEventListener('click', e => {
  if (e.currentTarget === e.target) ctx.clearRect(0, 0, cvs.width, cvs.height)
})
