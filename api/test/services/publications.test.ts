import app from '../../src/app';

describe('\'publications\' service', () => {
  it('registered the service', () => {
    const service = app.service('publications');
    expect(service).toBeTruthy();
  });
});
