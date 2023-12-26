describe('Layout', () => {
  beforeEach(() => {
    cy.viewport(1500, 900);
    cy.visit('');
  })
  it('gets rendered', () => {
    cy.get('.hero').should('have.length', 1)
    cy.screenshot()
  })
  it('has 6 navigation tabs', () => {
    cy.get('.hero .hero-foot .tabs li>a').should('have.length', 6)
  })
  it('first navigation tab is "Users"', () => {
    cy.get('.hero .hero-foot .tabs li>a').first().should('have.text', 'Users')
  })
})