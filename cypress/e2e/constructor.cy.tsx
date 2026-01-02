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

    cy.wait(1000);

    // Добавляем начинку
    cy.get('[data-testid="ingredients-mains"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click();

    cy.wait(1000);

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
    cy.wait(1000);
    cy.get('[data-testid="close-modal"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Открытие и закрытие модалки через оверлей', () => {
    cy.get('[data-testid="ingredients-mains"]')
      .contains('Филе Люминесцентного тетраодонтимформа')
      .click();

    cy.get('[data-testid="modal"]').should('be.visible');
    cy.wait(1000);
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');
  });
});
