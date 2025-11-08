/* ----------  bundle.js с JSON API + Supabase Storage  ---------- */

// Конфигурация API
const API_URL = 'http://localhost:3000/api';

// Конфигурация Supabase
const SUPABASE_URL = 'https://xomeedpgfxlluqxeyelw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvbWVlZHBnZnhsbHVxeGV5ZWx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjU2NDMwMSwiZXhwIjoyMDc4MTQwMzAxfQ.WeWS6EPaTGlO4V3wzSjmaFW4zmJ0UtzdlrtO4e4daFE';
const STORAGE_BUCKET = 'niborii';

// Утилита для работы с Supabase Storage
const SupabaseStorage = {
  // Загрузка файла в Supabase Storage
  uploadFile: async function(file, fileName) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Генерируем уникальное имя файла
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}_${fileName}`;
      
      const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${uniqueFileName}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          },
          body: file
        }
      );
      
      if (response.ok) {
        return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${uniqueFileName}`;
      } else {
        const error = await response.text();
        console.error('Upload error:', error);
        throw new Error('Ошибка загрузки файла');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  },
  
  // Получение публичного URL для файла
  getPublicUrl: function(fileName) {
    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${fileName}`;
  }
};

// Инициализация - ничего не делаем, данные читаются из JSON через API
console.log('🚀 Приложение готово. Данные работают через JSON API');

// База данных - РАБОТА С JSON ЧЕРЕЗ API
const DB = (function() {
  return {
    // Получение каталога игр из JSON
    getCatalogue: async function() {
      try {
        const response = await fetch(`${API_URL}/games`);
        return await response.json();
      } catch (error) {
        console.error('Ошибка загрузки игр:', error);
        return [];
      }
    },
    
    // Сохранение каталога игр в JSON
    saveCatalogue: async function(catalogue) {
      try {
        await fetch(`${API_URL}/games`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catalogue)
        });
        console.log('✅ Игры сохранены в games.json');
      } catch (error) {
        console.error('❌ Ошибка сохранения игр:', error);
      }
    },
    
    // Получение пользователей из JSON
    getUsers: async function() {
      try {
        const response = await fetch(`${API_URL}/users`);
        return await response.json();
      } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
        return [];
      }
    },
    
    // Сохранение пользователей в JSON
    saveUsers: async function(users) {
      try {
        await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(users)
        });
        console.log('✅ Пользователи сохранены в users.json');
      } catch (error) {
        console.error('❌ Ошибка сохранения пользователей:', error);
      }
    },
    
    // Добавление пользователя
    addUser: async function(email, pwd, role = 'user') {
      const users = await this.getUsers();
      if (users.find(u => u.email === email)) {
        throw 'exists';
      }
      users.push({
        email: email,
        password: pwd,
        role: role
      });
      await this.saveUsers(users);
      return Promise.resolve();
    },
    
    // Удаление пользователя
    deleteUser: async function(email) {
      const users = await this.getUsers();
      const filtered = users.filter(u => u.email !== email);
      await this.saveUsers(filtered);
      return Promise.resolve();
    },
    
    // Добавление игры
    addGame: async function(game) {
      const catalogue = await this.getCatalogue();
      game.id = catalogue.length > 0 ? Math.max(...catalogue.map(g => g.id)) + 1 : 1;
      catalogue.push(game);
      await this.saveCatalogue(catalogue);
      return Promise.resolve();
    },
    
    // Удаление игры
    deleteGame: async function(id) {
      const catalogue = await this.getCatalogue();
      const filtered = catalogue.filter(g => g.id !== id);
      await this.saveCatalogue(filtered);
      return Promise.resolve();
    }
  };
})();

// Система аутентификации
var Auth = (function() {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PWD_MIN = 6;
  
  function isValidEmail(email) {
    return EMAIL_RE.test(email);
  }
  
  function isValidPwd(password) {
    return password.length >= PWD_MIN;
  }
  
  // Регистрация
  function register(email, pwd) {
    if (!isValidEmail(email)) {
      return Promise.resolve({ok: false, msg: 'Некорректный e-mail'});
    }
    if (!isValidPwd(pwd)) {
      return Promise.resolve({ok: false, msg: 'Пароль должен содержать минимум 6 символов'});
    }
    
    return DB.addUser(email, pwd)
      .then(() => ({ok: true}))
      .catch(() => ({ok: false, msg: 'Пользователь с таким email уже существует'}));
  }
  
  // Вход
  async function login(email, pwd) {
    const users = await DB.getUsers();
    const user = users.find(u => u.email === email && u.password === pwd);
    
    if (!user) {
      return {ok: false, msg: 'Неверный email или пароль'};
    }
    
    // Сохраняем пользователя в sessionStorage
    sessionStorage.setItem('user', JSON.stringify(user));
    return {ok: true, role: user.role};
  }
  
  // Текущий пользователь
  function current() {
    return JSON.parse(sessionStorage.getItem('user') || 'null');
  }
  
  // Выход
  function logout() {
    sessionStorage.removeItem('user');
  }
  
  return {
    register: register,
    login: login,
    logout: logout,
    current: current,
    isValidEmail: isValidEmail,
    isValidPwd: isValidPwd
  };
})();