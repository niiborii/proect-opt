// Компоненты для динамической загрузки header и footer

class SiteComponents {
    static loadHeader() {
        const header = document.querySelector('header');
        if (!header) return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isAdminPage = currentPage === 'admin.html';
        const isAuthPage = currentPage === 'login.html' || currentPage === 'register.html';
        const isGameDetailPage = currentPage === 'game-details.html';
        const isCartPage = currentPage === 'cart.html';
        
        let navItems = '';
        let authSection = '';

        if (isAdminPage) {
            navItems = `
                <li><a href="../index.html">Главная</a></li>
                <li><a href="admin.html">Админка</a></li>
                <li><button id="logoutBtn" class="btn-login">Выйти</button></li>
            `;
        } else if (isAuthPage) {
            navItems = `
                <li><a href="../index.html">Главная</a></li>
                <li><a href="../index.html#catalog">Каталог</a></li>
                <li><a href="../index.html#new">Новинки</a></li>
                <li><a href="../index.html#sales">Акции</a></li>
                <li><a href="../index.html#contacts">Контакты</a></li>
            `;
            authSection = `<a href="login.html" class="btn-login">Войти</a>`;
        } else {
            // Для всех остальных страниц (главная, детали игры, корзина)
            navItems = `
                <li><a href="index.html">Главная</a></li>
                <li><a href="index.html#catalog">Каталог</a></li>
                <li><a href="index.html#new">Новинки</a></li>
                <li><a href="index.html#sales">Акции</a></li>
                <li><a href="index.html#contacts">Контакты</a></li>
            `;
            
            const currentUser = Auth.current();
            if (currentUser) {
                if (currentUser.role === 'admin') {
                    authSection = `
                        <a href="admin.html" class="btn-login">Админка</a>
                        <button id="logoutBtn" class="btn-login" style="margin-left: 10px;">Выйти</button>
                    `;
                } else {
                    authSection = `
                        <span style="color: #FFFFFE; margin-right: 10px;">${currentUser.email}</span>
                        <button id="logoutBtn" class="btn-login">Выйти</button>
                    `;
                }
            } else {
                authSection = `<a href="login.html" class="btn-login">Войти</a>`;
            }
        }

        header.innerHTML = `
            <div class="cont">
                <div class="hd-cnt">
                    <a href="${isAdminPage ? '../index.html' : 'index.html'}" class="logo" aria-label="На главную">
                        <img src="https://i.postimg.cc/dhdY51W1/logo-1.png" alt="STUCK" />
                    </a>
                    <nav aria-label="Главное меню">
                        <ul>
                            ${navItems}
                        </ul>
                    </nav>
                    <div class="hd-act">
                        ${authSection}
                        <button class="btn-cart" aria-label="Корзина" onclick="window.location.href='cart.html'">🛒</button>
                    </div>
                </div>
            </div>
        `;

        // Добавляем обработчик для выхода
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Auth.logout();
                if (isAdminPage) {
                    window.location.href = '../index.html';
                } else {
                    window.location.href = 'index.html';
                }
            });
        }

        // Инициализируем счетчик корзины
        if (typeof updateCartCounter === 'function') {
            updateCartCounter();
        }
    }

    static loadFooter() {
        const footer = document.querySelector('footer');
        if (!footer) return;

        footer.innerHTML = `
            <div class="cont">
                <div class="footer-bottom">
                    <p>&copy; Проверочная работа №3 / Попов Артём 9-ИС203 / Магазин ПК игр</p>
                </div>
            </div>
        `;
    }

    static init() {
        this.loadHeader();
        this.loadFooter();
    }
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    SiteComponents.init();
});