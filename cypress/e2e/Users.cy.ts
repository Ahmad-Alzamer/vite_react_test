describe('Users', () => {
  beforeEach(() => {
    cy.viewport(1500, 900);
    cy.visit('');
    cy.get('.hero .hero-foot .tabs li>a').first().click()
  })
  it('gets rendered', () => {
    cy.get('section#users').should('have.length', 1)
  })

  it('progress bar is displayed when still fetching data from backend', () => {
    cy.get('section#users progress.progress.is-small.is-primary').should('have.length', 1)
  })

  it('data is displayed in table after it is fetched', () => {
    cy.get('section#users table',{
      timeout:2000
    }).should('have.length', 1)

    cy.contains('ID')
        .closest('table')
        .should('have.length',1);
    cy.contains('Gender')
        .closest('table')
        .should('have.length',1);
    cy.contains('First Name')
        .closest('table')
        .should('have.length',1);
    cy.contains('Last Name')
        .closest('table')
        .should('have.length',1);
  })

})