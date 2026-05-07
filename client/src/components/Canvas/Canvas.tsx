import { useEffect, useRef } from 'react'
import { draw, clearCanvas, replayDrawing } from '../../utils/draw'
import type { Drawing, Stroke } from '../../types'

interface CanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  drawing: Drawing
  onStrokesUpdate: (strokes: Stroke[]) => void
  lastErasedAt: number
  setSelectedDrawing: (drawing: Drawing | null) => void
}

function Canvas({
  drawing,
  onStrokesUpdate,
  lastErasedAt,
  setSelectedDrawing,
  ...rest
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokesRef = useRef<Stroke[]>([])
  const startTimeRef = useRef<number | null>(null)

  const handleDrawingEnd = () => {
    onStrokesUpdate(strokesRef.current)
  }
  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    const handleResize = () => {
      canvas.width = window.innerWidth * (50 / 100)
      canvas.height = 500
    }

    window.addEventListener('resize', handleResize)

    handleResize()
    const { startStroke, drawStroke, endStroke } = draw(
      ctx,
      canvas,
      startTimeRef,
      strokesRef,
    )

    canvas.addEventListener('mousedown', startStroke)
    canvas.addEventListener('mousemove', drawStroke)
    canvas.addEventListener('mouseup', endStroke)

    if (drawing) {
      replayDrawing(drawing, canvas)
    }

    if (lastErasedAt > 0) {
      clearCanvas(ctx, canvas)
      setSelectedDrawing(null)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mouseup', endStroke)
      canvas.removeEventListener('mousedown', startStroke)
      canvas.removeEventListener('mousemove', drawStroke)
    }
  }, [drawing, lastErasedAt, setSelectedDrawing])
  return (
    <canvas
      onMouseUp={handleDrawingEnd}
      ref={canvasRef}
      id='#canvas'
      {...rest}
    ></canvas>
  )
}

export default Canvas
