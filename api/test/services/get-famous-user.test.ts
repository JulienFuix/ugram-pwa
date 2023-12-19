import app from '../../src/app';

describe('\'getFamousUser\' service', () => {
  it('registered the service', () => {
    const service = app.service('get-famous-user');
    expect(service).toBeTruthy();
  });
});
