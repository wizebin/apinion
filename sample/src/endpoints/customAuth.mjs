import { makeEndpoint, makeRequestAuthenticator } from 'apinion';

const tempAuthenticator = makeRequestAuthenticator((input) => {
  if (input?.headers?.secret === 'fancypants') return { admin: true };

  return null;
});

export default makeEndpoint({ authenticator: tempAuthenticator, required: ['a', 'b'], optional: ['c'] }, ({ identity, params }) => {
  if (identity?.admin) {
    return params.a + params.b + params.c;
  } else {
    return params.a;
  }
});
