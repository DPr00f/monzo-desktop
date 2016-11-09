import requireAuth from '../../../src/server/middlewares/requireAuth';

describe('requireAuth Middleware ::', () => {
  it('should export a function', () => {
    expect(requireAuth).to.be.a('function');
  });
});
