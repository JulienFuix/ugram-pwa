import app from '../../src/app';

describe('\'user_following\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-following');
    expect(service).toBeTruthy();
  });
});
