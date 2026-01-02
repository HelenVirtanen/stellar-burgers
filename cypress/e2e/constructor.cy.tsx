describe('Интеграционные тесты для страницы конструктора ', function () {
  beforeEach('Настроен перехват запроса на эндпоинт api/ingredients', () => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('Добавление булки, начинки и соуса в конструктор', () => {
    cy.get('[data-testid="ingredients-buns"]').find('button').first().click();
    cy.get('[data-testid="ingredients-mains"]').find('button').first().click();
    cy.get('[data-testid="ingredients-sauces"]').find('button').first().click();
  });
});
