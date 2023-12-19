import app from '../../src/app';

describe('\'publications_hashtags\' service', () => {
  it('registered the service', () => {
    const service = app.service('publications-hashtags');
    expect(service).toBeTruthy();
  });
});
