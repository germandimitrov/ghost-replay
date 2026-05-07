import Canvas from './components/Canvas/Canvas'
import { useState, useEffect } from 'react'
import type { Drawing, Stroke } from './types'
import Button from './components/Button/Button'
import { fromatReplayDate } from './utils/date'
const { VITE_API_URL: API_URL } = import.meta.env

function App() {
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null)
  const [strokesFromChild, setStrokesFromChild] = useState<Stroke[]>([])
  const [lastErasedAt, setLastEraseAt] = useState(0)

  const handleErase = () => {
    setLastEraseAt(Date.now())
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/drawings`)
        const data = await response.json()
        setDrawings(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  async function handleSave() {
    try {
      const payload: Drawing = {
        title: `Replay ${fromatReplayDate(new Date())}`,
        stroke_data: strokesFromChild,
      }
      const response = await fetch(`${API_URL}/drawings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        setDrawings((prev) => [data, ...prev])
      }
    } catch (error) {
      console.error('Submission error:', error)
    }
  }

  async function handleResetHistory() {
    try {
      const response = await fetch('http://localhost:8000/drawings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        setDrawings([])
        setSelectedDrawing(null)
      }
    } catch (error) {
      console.error('Submission error:', error)
    }
  }

  return (
    <>
      <h1 className='bg-blue-500 text-2xl text-center py-3 mb-8 text-white'>
        Ghost Replay
      </h1>
      <div className='flex flex-col justify-center'>
        <div className='flex justify-center'>
          <Canvas
            className='border-black-500 border-2 border-solid'
            drawing={selectedDrawing!}
            onStrokesUpdate={(data) => setStrokesFromChild(data)}
            lastErasedAt={lastErasedAt}
            setSelectedDrawing={setSelectedDrawing}
          />
        </div>
        <div className='flex justify-center mt-3 flex-col items-center'>
          <div className='flex gap-2'>
            <Button onClick={handleSave} variant={'primary'}>
              Save
            </Button>
            <Button onClick={handleErase} variant={'secondary'}>
              Erase
            </Button>
            <Button onClick={handleResetHistory} variant={'danger'}>
              Reset History
            </Button>
          </div>
          <div className='flex justify-center flex-col'>
            {drawings &&
              drawings.map((drawing) => {
                return (
                  <div
                    key={drawing.title}
                    className='cursor-pointer'
                    onClick={() => setSelectedDrawing(drawing)}
                  >
                    {drawing.title}
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
