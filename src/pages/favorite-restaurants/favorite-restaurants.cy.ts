/// <reference types="Cypress" />

describe('Favorite Restaurants Page', () => {
  beforeEach(() => {
    cy.visit('/#/favorite');
  });

  it('should show loading indicator', () => {
    cy.reload();
    cy.get('ui-loading').should('be.visible');
  });

  it('should show no data if there is no favorite restaurants', () => {
    cy.get('ui-no-data').should('be.visible');
  });

  it('should show favorite restaurant after adding new favorite restaurant', () => {
    cy.visit('/#/detail/s1knt6za9kkfw1e867');
    cy.contains(/add to favorite/i).click();
    cy.visit('/#/favorite');
    cy.get('#restaurant-list').within(() => {
      cy.get('restaurant-preview-card').should('have.length', 1);
    });
  });

  it('should show no data after removing last favorite restaurant', () => {
    cy.get('#restaurant-list')
      .first()
      .within(() => {
        cy.get('a').click();
      });
    cy.contains(/remove from favorite/i).click();
    cy.visit('/#/favorite');
    cy.get('ui-no-data').should('be.visible');
  });
});
