import { type Request, type Response, Router } from 'express';
import { getDB } from './db';
import { v4 as uuidv4 } from 'uuid';

const router = Router();


router.delete('/drawings', (req, res) => {
  const db = getDB()

  async function clearAllData() {
    await db.run('DELETE FROM drawing_data');
    console.log("All drawings and stroke data have been cleared.");
  }

  clearAllData()
  
  res.status(201).json({
    message: 'Records Deleted',
    data: {}
  });
})


router.get('/drawings', async (req: Request, res: Response) => {
  const db = getDB()
  const data = await db.all(`SELECT * FROM drawing_data order by created_at DESC`)

  return res.status(201).json(data.slice(0, 3));
})

router.post('/drawings', async (req: Request<{}>, res: Response) => {
  const db = getDB()
  const newId = uuidv4(); 
  const data = [newId, req.body.title, JSON.stringify(req.body.stroke_data)]
  try {
    const record = await db.get(
      `INSERT INTO drawing_data (id, title, stroke_data, created_at) 
        VALUES (?, ?, ?, datetime('now')) RETURNING *`,
      data
    );
    res.status(201).json(record);

  } catch (error) {
    throw error
  }
});

export default router;