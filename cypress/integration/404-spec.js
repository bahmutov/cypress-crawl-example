/// <reference types="cypress" />

// watch the video "Test 404 Page"
// https://youtu.be/0OfILKbqbsg
it('shows 404 error', () => {
  const url = '/does-not-exist'
  cy.request({ url, failOnStatusCode: false })
    .its('status', { timeout: 0 })
    .should('eq', 404)
  cy.visit(url, { failOnStatusCode: false })
  cy.contains('span', '404').should('be.visible')
})
