describe('Интеграционные тесты для страницы конструктора ', function () {
  beforeEach('Настроен перехват запроса на эндпоинт api/ingredients', () => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('Добавление булки, начинки и соуса в конструктор', () => {
    // Добавляем булку
    cy.get('[data-testid="ingredients-buns"]')
      .contains('Флюоресцентная булка R2-D3')
      .parent()
      .find('button')
      .click();

    // Добавляем начинку
    cy.get('[data-testid="ingredients-mains"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click();

    // Добавляем соус
    cy.get('[data-testid="ingredients-sauces"]')
      .contains('Соус Spicy-X')
      .parent()
      .find('button')
      .click();
  });

  it('Открытие и закрытие модалки по крестику', () => {
    cy.get('[data-testid="ingredients-buns"]')
      .contains('Флюоресцентная булка R2-D3')
      .click();

    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="close-modal"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Открытие и закрытие модалки через оверлей', () => {
    cy.get('[data-testid="ingredients-mains"]')
      .contains('Филе Люминесцентного тетраодонтимформа')
      .click();

    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Создание заказа', () => {
    // Подставляются моковые токены авторизации
    cy.fixture('login.json').then((loginData) => {
      cy.setCookie('accessToken', loginData.accessToken);
      cy.setCookie('refreshToken', loginData.refreshToken);
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

    cy.visit('http://localhost:4000');

    // Сборка бургера
    cy.get('[data-testid="ingredients-buns"]')
      .contains('Флюоресцентная булка R2-D3')
      .parent()
      .find('button')
      .click();

    cy.get('[data-testid="ingredients-mains"]')
      .contains('Филе Люминесцентного тетраодонтимформа')
      .parent()
      .find('button')
      .click();

    cy.get('[data-testid="ingredients-mains"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click();

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
    cy.get('[data-testid="close-modal"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    // Проверка сброса конструктора
    cy.get('[data-testid="burger-constructor"]').should('not.have.descendants');
  });
});
