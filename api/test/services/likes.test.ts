import app from '../../src/app';

describe('\'Likes\' service', () => {
  it('registered the service', () => {
    const service = app.service('likes');
    expect(service).toBeTruthy();
  });
});
