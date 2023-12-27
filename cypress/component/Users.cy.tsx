import {Users} from "../../src/UI/pages/users/Users";
import {QueryClient, QueryClientProvider} from "react-query";
import {worker} from '../../src/msw/browser';

describe('Users.cy.tsx', () => {
    const queryClient = new QueryClient();
    beforeEach(async ()=>{
        await worker.start();
    })

    it('gets rendered', () => {
        cy.mount(
            <QueryClientProvider client={queryClient}>
                <Users />
            </QueryClientProvider>
        )
        cy.get('section#users').should('have.length', 1)
    })

    it('progress bar is displayed when still fetching data from backend', () => {
        cy.mount(
            <QueryClientProvider client={queryClient}>
                <Users />
            </QueryClientProvider>
        )
        cy.get('section#users progress.progress.is-small.is-primary').should('have.length', 1)
    })

    it('data is displayed in table after it is fetched', () => {
        cy.mount(
            <QueryClientProvider client={queryClient}>
                <Users />
            </QueryClientProvider>
        )
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
