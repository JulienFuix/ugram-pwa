import app from '../../src/app';

describe('\'hashtags\' service', () => {
  it('registered the service', () => {
    const service = app.service('hashtags');
    expect(service).toBeTruthy();
  });
});
