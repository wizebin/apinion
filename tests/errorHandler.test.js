import * as apinion from '..';
import fetch from 'node-fetch';

describe('error handler propagation', () => {
  it('awaits a parent router error handler instead of orphaning its rejection', async () => {
    const rejections = [];
    const collectRejection = (error) => rejections.push(error);
    process.on('unhandledRejection', collectRejection);

    const router = new apinion.Router();
    let handlerCalls = 0;

    // A handler registered on the ROOT while the endpoint lives several
    // subrouters deep — the delegation path, not the direct one.
    router.addErrorHandler(async ({ response }) => {
      handlerCalls += 1;
      // What a real handler does: try to send a body on a response whose
      // headers already went out with the stream. This throws.
      response.status(500).send('too late');
    });

    const streamingEndpoint = {
      config: {},
      callback: ({ response }) => {
        response.write('partial\n');
        response.end();
        throw new Error('exploded after streaming');
      },
    };

    router.applyRoutes([
      { path: 'v1', subrouter: [
        { path: 'deep', subrouter: [
          { path: '/stream', get: streamingEndpoint },
        ] },
      ] },
    ]);

    await router.listen(65520);

    const fetchResult = await fetch('http://localhost:65520/v1/deep/stream');
    expect(await fetchResult.text()).toEqual('partial\n');

    // Give any orphaned rejection a chance to surface before we stop listening.
    await new Promise(resolve => setTimeout(resolve, 100));
    process.off('unhandledRejection', collectRejection);
    router.close();

    expect(handlerCalls).toEqual(1);
    expect(rejections).toEqual([]);
  });
});
