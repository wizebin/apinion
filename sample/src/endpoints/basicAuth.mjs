import { makeEndpoint, makeHardcodedBasicAuthenticator } from 'apinion';

const tempAuthenticator = makeHardcodedBasicAuthenticator([{ username: 'joe', password: 'doe' }]);

export default makeEndpoint({ authenticator: tempAuthenticator }, ({ identity }) => {
  return {
    authenticated: true,
    identity,
  };
});
