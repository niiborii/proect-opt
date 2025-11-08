// Дополнительные скрипты для главной страницы

// Плавная прокрутка к якорям
document.addEventListener('DOMContentLoaded', function() {
  // Навигационные ссылки с якорями
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Анимация появления элементов при прокрутке
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Наблюдение за элементами
  const animatedElements = document.querySelectorAll('.game-card, .admin-section, .stat-card');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Функция для отображения уведомлений
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  `;
  
  // Цвета для разных типов уведомлений
  const colors = {
    info: '#4ECDC4',
    success: '#2ECC71',
    warning: '#F39C12',
    error: '#E74C3C'
  };
  
  notification.style.backgroundColor = colors[type] || colors.info;
  
  document.body.appendChild(notification);
  
  // Анимация появления
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Автоматическое исчезновение
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Обработка корзины (пример)
let cart = JSON.parse(localStorage.getItem('stuck_cart') || '[]');

function addToCart(gameId, title, price) {
  const existingItem = cart.find(item => item.id === gameId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: gameId,
      title: title,
      price: price,
      quantity: 1
    });
  }
  
  localStorage.setItem('stuck_cart', JSON.stringify(cart));
  showNotification(`"${title}" добавлена в корзину!`, 'success');
  updateCartCounter();
}

function updateCartCounter() {
  const cartBtn = document.querySelector('.btn-cart');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalItems > 0) {
    let counter = cartBtn.querySelector('.cart-counter');
    if (!counter) {
      counter = document.createElement('span');
      counter.className = 'cart-counter';
      counter.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background: #FF5050;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      `;
      cartBtn.style.position = 'relative';
      cartBtn.appendChild(counter);
    }
    counter.textContent = totalItems;
  }
}

// Инициализация счетчика корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  updateCartCounter();
  
  // Добавляем обработчики для кнопок "Добавить в корзину"
  const addToCartBtns = document.querySelectorAll('.btn-add-cart');
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const gameId = this.dataset.gameId;
      const title = this.dataset.title;
      const price = parseInt(this.dataset.price);
      addToCart(gameId, title, price);
    });
  });
});

// Глобальные функции для работы с корзиной
window.addToCart = function(gameId, title, price) {
  let cart = JSON.parse(localStorage.getItem('stuck_cart') || '[]');
  const existingItem = cart.find(item => item.id === gameId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: gameId,
      title: title,
      price: price,
      quantity: 1
    });
  }
  
  localStorage.setItem('stuck_cart', JSON.stringify(cart));
  showNotification(`"${title}" добавлена в корзину!`, 'success');
  updateCartCounter();
};

window.updateCartCounter = function() {
  const cartBtn = document.querySelector('.btn-cart');
  if (!cartBtn) return;
  
  const cart = JSON.parse(localStorage.getItem('stuck_cart') || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalItems > 0) {
    let counter = cartBtn.querySelector('.cart-counter');
    if (!counter) {
      counter = document.createElement('span');
      counter.className = 'cart-counter';
      counter.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background: #FF5050;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      `;
      cartBtn.style.position = 'relative';
      cartBtn.appendChild(counter);
    }
    counter.textContent = totalItems;
  } else {
    const counter = cartBtn.querySelector('.cart-counter');
    if (counter) {
      cartBtn.removeChild(counter);
    }
  }
};

window.showNotification = function(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  `;
  
  // Цвета для разных типов уведомлений
  const colors = {
    info: '#4ECDC4',
    success: '#2ECC71',
    warning: '#F39C12',
    error: '#E74C3C'
  };
  
  notification.style.backgroundColor = colors[type] || colors.info;
  
  document.body.appendChild(notification);
  
  // Анимация появления
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Автоматическое исчезновение
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
};