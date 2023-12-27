import {QueryClient, QueryClientProvider} from "react-query";
import {worker} from "../../src/msw/browser";
import Layout from "../../src/UI/pages/Layout";

describe('Layout', () => {
  const queryClient = new QueryClient();
  beforeEach(async () => {
    await worker.start();
    cy.viewport(1500, 900);
  })

  it('gets rendered', () => {
    cy.mount(
        <QueryClientProvider client={queryClient}>
          <Layout />
        </QueryClientProvider>
    )
    cy.get('.hero').should('have.length', 1)
    cy.screenshot()
  })
  it('has 6 navigation tabs', () => {
    cy.mount(
        <QueryClientProvider client={queryClient}>
          <Layout />
        </QueryClientProvider>
    )
    cy.get('.hero .hero-foot .tabs li>a').should('have.length', 6)
  })
  it('first navigation tab is "Users"', () => {
    cy.mount(
        <QueryClientProvider client={queryClient}>
          <Layout />
        </QueryClientProvider>
    )
    cy.get('.hero .hero-foot .tabs li>a').first().should('have.text', 'Users')
  })
})