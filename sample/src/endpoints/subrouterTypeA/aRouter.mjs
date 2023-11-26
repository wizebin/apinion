import { makeEndpoint } from 'apinion';

// It's generally recommended to put these endpoints in a separate file
const customEndpoint = makeEndpoint({ name: 'custom', required: ['z'] }, async (params) => {
  return { something: 'another' };
});

const customEndpoint2 = makeEndpoint({ name: 'custom2' }, async (params) => {
  return { message: 'hola' };
});

const customEndpoint3 = makeEndpoint({ name: 'custom3' }, async (params) => {
  return { action: 'do the thing' };
});

export default [
  {
    path: 'aRouter',
    any: makeEndpoint({}, () => 'arouter'),
    subrouter: [
      { path: 'test', get: customEndpoint },
      { path: 'test2', post: customEndpoint2 },
      { path: 'test3', any: customEndpoint3 },
    ],
  }
];
