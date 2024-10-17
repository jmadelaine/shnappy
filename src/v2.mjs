const processArgs = (...args) => {
  const [a0, a1] = args
  if (typeof a0 === 'number' && typeof a1 === 'number') return [a0, a1]
  if (typeof a0 === 'object') {
    if ('0' in a0 && '1' in a0) return [a0[0], a0[1]]
    if ('x' in a0 && 'y' in a0) return [a0.x, a0.y]
  }
  throw new Error('v2 args must be v2(number, number), v2([number, number]), or v2({ x: number, y: number })')
}

const v2 = (...args) => {
  const [x, y] = processArgs(...args)

  return {
    get xy() {
      return [x, y]
    },
    get 0() {
      return x
    },
    get x() {
      return x
    },
    x(x) {
      if (typeof x !== 'number') throw new Error('Parameter x must be of type number.')
      return v2(x, y)
    },
    get 1() {
      return y
    },
    get y() {
      return y
    },
    y(y) {
      if (typeof y !== 'number') throw new Error('Parameter y must be of type number.')
      return v2(x, y)
    },
  }
}

export default v2
