// Jest mock for CSS modules: returns the class name as its identifier so
// tests can assert on className presence without importing real CSS.
module.exports = new Proxy(
  {},
  {
    get: (_target, prop) => {
      if (prop === '__esModule') return false;
      return String(prop);
    },
  },
);
