/// <reference types="cypress" />

it('crawls all local pages with resolving duplicates', () => {
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
        // convert the jQuery object to a real array
        const localUrls = $links
          .toArray()
          .map((link) => link.getAttribute('href'))
          .filter((url) => !url.startsWith('http'))

        // check URLs by requesting them and getting through the redirects
        const redirected = []
        localUrls.forEach((url) => {
          cy.request({ url, log: false })
            .its('redirects', { log: false })
            .should(Cypress._.noop)
            .then((redirects) => {
              if (Array.isArray(redirects) && redirects.length > 0) {
                // each redirect record is like "301: URL"
                const redirectedUrl =
                  redirects[redirects.length - 1].split(' ')[1]
                const parsed = new URL(redirectedUrl)
                redirected.push(parsed.pathname)
              } else {
                redirected.push(url)
              }
            })
        })

        cy.then(() => {
          const newUrls = redirected
            .filter((url) => !visited.has(url))
            .filter((url) => !toVisit.includes(url))
          cy.log(`found ${newUrls.length} new link(s) to visit`)
          newUrls.forEach((url) => {
            cy.log(`  ${url}`)
          })
          console.log(newUrls)
          toVisit.push(...newUrls)
        })
      })
      .then(visitNextUrl)
  }

  visitNextUrl()
})
