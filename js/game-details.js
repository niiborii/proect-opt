// Получаем id из адресной строки
const params = new URLSearchParams(location.search);
const gameId  = Number(params.get('id'));

const game = DB.getCatalogue().find(g => g.id === gameId);

if (!game) {
  document.getElementById('detailRoot').innerHTML =
    '<p>Игра не найдена. <a href="../index.html">Вернуться в каталог</a></p>';
} else {
  document.getElementById('gameTitle').textContent = `${game.title} — STUCK`;

  document.getElementById('detailRoot').innerHTML = `
    <div>
      <img src="${game.cover}" alt="${game.title}" class="game-detail-image">
    </div>
    <div class="game-detail-info">
      <h1>${game.title}</h1>
      <div class="game-detail-price">${game.price} ₽</div>

      <p><strong>Жанр:</strong> ${game.genre}</p>
      <p><strong>Разработчик:</strong> ${game.developer}</p>
      <p><strong>Издатель:</strong> ${game.publisher}</p>
      <p><strong>Дата выхода:</strong> ${game.releaseDate}</p>

      <h3>Описание:</h3>
      <p>${game.description}</p>

      <h3>Особенности:</h3>
      <ul>${game.features.map(f => `<li>${f}</li>`).join('')}</ul>

      <button class="btn-primary" style="margin-top:20px"
              onclick="addToCart(${game.id}, '${game.title}', ${game.price})">
        Добавить в корзину
      </button>
    </div>
  `;
}