import type { RefObject } from 'react'
import type { Drawing, Stroke } from '../types'

export const draw = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  startTime: RefObject<number | null>,
  strokesRef: RefObject<Stroke[]>,
) => {
  let drawing = false

  function _getCurrentCoordinates(
    event: MouseEvent,
    canvas: HTMLCanvasElement,
  ) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    return [x, y]
  }

  function _recordEvent(
    type: 'S' | 'M' | 'E',
    x: number,
    y: number,
    startTimeRef: RefObject<number | null>,
    strokesRef: RefObject<Stroke[]>,
  ) {
    if (startTimeRef.current === null) startTimeRef.current = Date.now()

    const timeOffset = Date.now() - startTimeRef.current
    const newPoint: Stroke = [x, y, timeOffset, type]

    strokesRef.current.push(newPoint)
  }
  function startStroke(event: MouseEvent) {
    drawing = true
    const [x, y] = _getCurrentCoordinates(event, canvas)
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(x, y)

    _recordEvent('S', x, y, startTime, strokesRef)
  }

  function drawStroke(event: MouseEvent) {
    if (!drawing) return
    ctx.lineWidth = 1
    const [x, y] = _getCurrentCoordinates(event, canvas)
    ctx.lineTo(x, y)
    ctx.stroke()
    _recordEvent('M', x, y, startTime, strokesRef)
  }

  function endStroke(event: MouseEvent) {
    drawing = false
    const [x, y] = _getCurrentCoordinates(event, canvas)

    ctx.closePath()
    _recordEvent('E', x, y, startTime, strokesRef)
  }

  return { startStroke, drawStroke, endStroke }
}

export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

export const replayDrawing = (
  drawingData: Drawing,
  canvas: HTMLCanvasElement,
) => {
  const ctx = canvas?.getContext('2d')
  if (!ctx || !canvas) return

  const data = JSON.parse(drawingData.stroke_data as string)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const startTime = performance.now()
  let currentIndex = 0

  const render = (now: number) => {
    const elapsed = now - startTime

    while (currentIndex < data.length) {
      const [x, y, timeOffset, type] = data[currentIndex]
      if (timeOffset <= elapsed) {
        if (type === 'S') {
          ctx.beginPath()
          ctx.moveTo(x, y)
        } else if (type === 'M') {
          ctx.lineTo(x, y)
          ctx.stroke()
        } else if (type === 'E') {
          ctx.beginPath()
        }
        currentIndex++
      } else {
        break
      }
    }

    if (currentIndex < data.length) {
      requestAnimationFrame(render)
    }
  }

  requestAnimationFrame(render)
}
