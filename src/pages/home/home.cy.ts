function isInViewport(selector: string) {
  cy.get(selector).then(($el) => {
    cy.window().then((window) => {
      const { documentElement } = window.document;
      const bottom = documentElement.clientHeight;
      const right = documentElement.clientWidth;
      const rect = $el[0]!.getBoundingClientRect();
      expect(rect.top).to.be.lessThan(bottom);
      expect(rect.bottom).to.be.greaterThan(0);
      expect(rect.right).to.be.greaterThan(0);
      expect(rect.left).to.be.lessThan(right);
    });
  });
}

describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should scroll to main content when "browse catalogue" button is clicked', () => {
    cy.contains(/browse catalogue/i).click();

    isInViewport('#main-content');
  });

  it('should show restaurant catalogue', () => {
    cy.get('restaurant-catalogue > #restaurant-list > restaurant-preview-card')
      .should('be.visible')
      .and('have.length.at.least', 1);
  });
});
