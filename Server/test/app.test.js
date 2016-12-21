'use strict';

const path = require(`path`);
const proxyquire = require(`proxyquire`).noPreserveCache();
const request = require(`supertest`);
const assert = require('chai').assert;

const SAMPLE_PATH = path.join(__dirname, `../app.js`);

function getSample () {
  const app = proxyquire(SAMPLE_PATH, {});
  return {
    app: app,
    mocks: {}
  };
}

describe(`test barcode server routes`, () => {
  let sample;

  beforeEach(() => {
    sample = getSample();
  });

  it(`should redirect to product/barcode add page`, (done) => {
    request(sample.app)
      .get(`/`)
      .expect(302)
      .end(done);
  });

  it(`should render success page with status 200`, (done) => {
    request(sample.app)
      .get(`/barcodes/pages/success`)
      .expect(200)
      .end(done);
  });

  it(`should render error page with status 500`, (done) => {
    request(sample.app)
      .get(`/barcodes/pages/error`)
      .expect(500)
      .end(done);
  });

  it(`should catch 404`, (done) => {
    const expectedResult = `Error: Not Found`;

    request(sample.app)
      .get(`/doesnotexist`)
      .expect(404)
      .expect((response) => {
        assert(response.text.indexOf(expectedResult) !== -1);
      })
      .end(done);
  });
});
