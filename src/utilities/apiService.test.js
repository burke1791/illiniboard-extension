const { apiPost } = require('./apiService');

beforeAll(() => {
  window.fetch = () => {
    return Promise.resolve({
      json: () => Promise.resolve()
    });
  };
});

beforeEach(() => {
  jest.spyOn(window, 'fetch');
});

describe('apiService', () => {
  const apiGet = require('./apiService').apiGet;
  const apiPost = require('./apiService').apiPost;

  test('apiGet', () => {
    return apiGet('/testEndpoint').then(() => {
      expect(window.fetch).toBeCalled();
    });
  });

  test('apiPost', () => {
    return apiPost('/testEndpoint').then(() => {
      expect(window.fetch).toBeCalled();
    });
  });

  test('determinePollEligibility', () => {
    const determinePollEligibility = require('./apiService').determinePollEligibility;

    let lastPoll = new Date('1 Aug 2020');

    let eligibility = determinePollEligibility(lastPoll);
    expect(eligibility).toBe(true);

    let undef = determinePollEligibility();
    expect(undef).toBe(false);
  });
});