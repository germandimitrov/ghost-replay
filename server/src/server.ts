import express from "express"
import router from './router';
import cors from 'cors'
import { initDB } from './db';

const app = express();
const PORT = 8000;

async function startServer() {
  await initDB()

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
   });

}

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router)


startServer().catch(err => {
  console.error("Failed to start server:", err);
});

