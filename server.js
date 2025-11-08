const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Пути к JSON файлам
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const GAMES_FILE = path.join(__dirname, 'data', 'games.json');

// === API для пользователей ===

// Получить всех пользователей
app.get('/api/users', async (req, res) => {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Ошибка чтения users.json:', error);
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

// Сохранить пользователей
app.post('/api/users', async (req, res) => {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка записи users.json:', error);
    res.status(500).json({ error: 'Ошибка записи данных' });
  }
});

// === API для игр ===

// Получить все игры
app.get('/api/games', async (req, res) => {
  try {
    const data = await fs.readFile(GAMES_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Ошибка чтения games.json:', error);
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

// Сохранить игры
app.post('/api/games', async (req, res) => {
  try {
    await fs.writeFile(GAMES_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка записи games.json:', error);
    res.status(500).json({ error: 'Ошибка записи данных' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📁 Данные: users.json, games.json`);
  console.log(`🌐 Главная страница: http://localhost:${PORT}/html/index.html`);
});

