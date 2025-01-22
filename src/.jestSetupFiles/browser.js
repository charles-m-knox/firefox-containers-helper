// eslint-disable-next-line no-undef
global.browser = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
    },
    sync: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
    },
  },
  contextualIdentities: {
    get: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
    query: jest.fn(),
  },
  commands: {
    reset: jest.fn(),
    update: jest.fn(),
    getAll: jest.fn(),
  },
  tabs: {
    Tab: {},
    create: jest.fn(),
    query: jest.fn(),
    TAB_ID_NONE: 100,
  },
};

// eslint-disable-next-line no-undef
window.navigator = {
  platform: 'linux',
};
