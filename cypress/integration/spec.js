/// <reference types="cypress" />

it('crawls all local pages', () => {
  // let's keep track of all URLs we've visited
  // NOTE: these URLs do not disambiguate between pages
  // so if /about.html and /about are the same page,
  // we will visit it twice if there are links to it
  const visited = new Set()
  const toVisit = ['/']

  function visitNextUrl() {
    if (toVisit.length === 0) {
      return
    }

    const url = toVisit.pop()
    if (visited.has(url)) {
      return visitNextUrl()
    }

    visited.add(url)
    cy.visit(url)

    cy.get('a')
      // there might not be any links on the page
      // thus we need to ignore the built-in element check
      .should(Cypress._.noop)
      .then(($links) => {
        const localUrls = $links
          .toArray()
          .map((link) => link.getAttribute('href'))
          .filter((url) => !url.startsWith('http'))
          .filter((url) => !visited.has(url))
        cy.log(`found ${localUrls.length} new link(s) to visit`)
        toVisit.push(...localUrls)
      })
      .then(visitNextUrl)
  }

  visitNextUrl()
})
