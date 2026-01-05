describe('Интеграционные тесты для страницы конструктора ', function () {
  beforeEach('Настроен перехват запроса на эндпоинт api/ingredients', () => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach('Очистка cookies и localStorage', () => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Добавление булки, начинки и соуса в конструктор', () => {
    cy.addIngredient('ingredients-buns', 'Флюоресцентная булка R2-D3');
    cy.addIngredient('ingredients-mains', 'Биокотлета из марсианской Магнолии');
    cy.addIngredient('ingredients-sauces', 'Соус Spicy-X');
  });

  it('Открытие, проверка названия ингредиента и закрытие модалки по крестику', () => {
    const ingredient = 'Флюоресцентная булка R2-D3';
    cy.openIngredientModal(ingredient);
    cy.closeModal('cross');
  });

  it('Закрытие модалки через оверлей', () => {
    const ingredient = 'Филе Люминесцентного тетраодонтимформа';
    cy.openIngredientModal(ingredient);
    cy.closeModal('overlay');
  });

  it('Закрытие модалки по нажатию Esc', () => {
    const ingredient = 'Соус фирменный Space Sauce';
    cy.openIngredientModal(ingredient);
    cy.closeModal('esc');
  });

  it('Создание заказа', () => {
    // Подставляются моковые токены авторизации
    cy.fixture('login.json').then((loginData) => {
      cy.setCookie('accessToken', loginData.accessToken);
      cy.setCookie('refreshToken', loginData.refreshToken);
      cy.window().then((win) => {
        win.localStorage.setItem('accessToken', loginData.accessToken);
        win.localStorage.setItem('refreshToken', loginData.refreshToken);
      });
    });

    // Мок ответа на запрос данных пользователя
    cy.fixture('user.json').then((userData) => {
      cy.intercept('GET', '/api/auth/user', {
        statusCode: 200,
        body: userData
      });
    });

    // Мок ответа на запрос создания заказа
    cy.fixture('order.json').then((response) => {
      cy.intercept('POST', '/api/orders', { statusCode: 200, body: response });
    });

    cy.visit('/');

    // Сборка бургера
    cy.addIngredient('ingredients-buns', 'Флюоресцентная булка R2-D3');
    cy.addIngredient(
      'ingredients-mains',
      'Филе Люминесцентного тетраодонтимформа'
    );
    cy.addIngredient('ingredients-mains', 'Биокотлета из марсианской Магнолии');

    // Клик по кнопке "Оформить заказ"
    cy.get('button').contains('Оформить заказ').click();

    // Проверка открытия модального окна
    cy.get('[data-testid="modal"]').should('be.visible');

    // Проверка номера заказа
    cy.fixture('order.json').then((orderData) => {
      cy.get('[data-testid="order-number"]').should(
        'contain.text',
        orderData.order.number
      );
    });

    // Проверка закрытия модального окна
    cy.closeModal('cross');

    // Проверка сброса конструктора
    cy.get('[data-testid="burger-constructor"]').should('not.have.descendants');
  });
});
