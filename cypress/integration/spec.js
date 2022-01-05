/// <reference types="cypress" />

// watch the video "Crawl Local Pages Using Cypress"
// https://youtu.be/FDNeiwKWdb4
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

    cy.log(`to visit: ${toVisit.join(', ')}`)
    // .pop() removes the last element from the array
    // .shift() removes the first element from the array
    // I prefer to take the first link to have breadth-first traversal
    const url = toVisit.shift()
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
          // do not visit other domains
          .filter((url) => !url.startsWith('http') && !url.startsWith('//'))
          // we have already seen this URL
          .filter((url) => !visited.has(url))
          // we have already queued this URL
          .filter((url) => !toVisit.includes(url))
        cy.log(`found ${localUrls.length} new link(s) to visit`)
        toVisit.push(...localUrls)
      })
      // cy.then automatically waits for all links above to be added
      // before continuing with the next URL
      .then(visitNextUrl)
  }

  visitNextUrl()
})
