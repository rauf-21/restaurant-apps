/// <reference types="Cypress" />

describe('Restaurant Detail Page', () => {
  beforeEach(() => {
    cy.visit('/#/detail/s1knt6za9kkfw1e867');
  });

  it('should show loading indicator', () => {
    cy.get('ui-loading').should('be.visible');
  });

  it('should show error if there is no restaurant id in the url', () => {
    cy.visit('/#/detail/');
    cy.get('ui-error').should('be.visible');
  });

  it('should show restaurant information', () => {
    cy.get('#restaurant-picture-and-information').as(
      'restaurant-picture-and-information'
    );

    // Should show restaurant picture
    cy.get('@restaurant-picture-and-information')
      .find('img')
      .should('be.visible');

    // Should show restaurant name
    cy.get('@restaurant-picture-and-information')
      .find('#restaurant-information > #restaurant-information-header > h1')
      .should('be.visible')
      .and('not.be.empty');

    // Each data description should not be empty
    cy.get('@restaurant-picture-and-information')
      .find('#restaurant-information > dl > dd')
      .each((element) => cy.wrap(element).should('not.be.empty'));
  });

  it('should show restaurant menu', () => {
    cy.get('#restaurant-menu').as('restaurant-menu');

    // Should show food menu
    cy.get('@restaurant-menu')
      .find('#restaurant-menu-food-list > restaurant-menu-card')
      .should('be.visible')
      .and('not.be.empty');

    // Should show drink menu
    cy.get('@restaurant-menu')
      .find('#restaurant-menu-drink-list > restaurant-menu-card')
      .should('be.visible')
      .and('not.be.empty');
  });

  it('should show restaurant customer reviews', () => {
    cy.get('#restaurant-customer-reviews > .restaurant-customer-review').should(
      'have.length.at.least',
      1
    );
  });

  it('can add restaurant to favorite', () => {
    cy.contains(/add to favorite/i).click();

    cy.contains(/remove from favorite/i).should('be.visible');
  });

  it('can remove restaurant from favorite', () => {
    cy.contains(/remove from favorite/i).click();

    cy.contains(/add to favorite/i).should('be.visible');
  });

  it('can add new customer review', () => {
    const customerName = 'Test';
    const customerReview = 'I am from test';

    cy.get('#restaurant-customer-review-form').within(() => {
      cy.get('input[name="name"]').type(customerName);
      cy.get('textarea[name="review"]').type(customerReview);
      cy.get('button[type="submit"]').click();
    });

    cy.get('#restaurant-customer-reviews > .restaurant-customer-review')
      .last()
      .within(() => {
        cy.get('.restaurant-customer-review-name').should(
          'contain.text',
          customerName
        );
        cy.get('p').should('contain.text', customerReview);
      });
  });
});
