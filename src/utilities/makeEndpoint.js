export function makeEndpoint(config, executionFunction) {
  return {
    config,
    callback: executionFunction,
  };
}
