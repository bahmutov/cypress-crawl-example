# cypress-crawl-example ![cypress version](https://img.shields.io/badge/cypress-9.2.0-brightgreen) [![ci](https://github.com/bahmutov/cypress-crawl-example/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/bahmutov/cypress-crawl-example/actions/workflows/ci.yml)

> Crawling all local pages using Cypress example

Cypress is not built to be a fast crawler, but for simple tests it will do. In this example, we crawl all pages reachable from the root page. See [spec.js](./cypress/integration/spec.js)

![Crawling local pages](./images/crawl.gif)

In [spec2.js](./cypress/integration/spec2.js) we resolve duplicate URLs by checking them using [cy.request](https://on.cypress.io/request) and taking the redirected URL.

## Testing 404 page

There is automatic 404 page when trying to visit a non-existent page. The test in [404-spec.js](./cypress/integration/404-spec.js) implements the test.

![404 spec](./images/404-spec.png)

## Videos

- [Crawl Local Pages Using Cypress](https://youtu.be/FDNeiwKWdb4)

## To run

```
$ npm install
$ npm run dev
```
