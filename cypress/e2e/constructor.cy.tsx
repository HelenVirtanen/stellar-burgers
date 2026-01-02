describe('Интеграционные тесты для страницы конструктора ', function () {
  it('Настроен перехват запроса на эндпоинт api/ingredients', function () {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });
});
