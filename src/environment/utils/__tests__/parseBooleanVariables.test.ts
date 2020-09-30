import { parseBooleanVariables } from '../parseBooleanVariables';

describe('parseBooleanVariables', () => {
  const mockedConfig = {
    ENV: 'staging',
    API_ENDPOINT: 'your-api.com',
    WEBSOCKET_ENDPOINT: 'websocket-endpoint',
    FEATURE_FLAG_CHEAT_CODES: 'true',
    FEATURE_FLAG_CODE_PUSH: 'true',
    FEATURE_FLAG_CODE_PUSH_MANUAL: 'false',
  };
  const convertedConfig = parseBooleanVariables(mockedConfig);

  it('should generate falsy values for feature flags used with false', () => {
    expect(convertedConfig.FEATURE_FLAG_CODE_PUSH_MANUAL).toBeFalsy();
  });
  it('should generate truthy values for feature flags used with true', () => {
    expect(convertedConfig.FEATURE_FLAG_CODE_PUSH).toBeTruthy();
  });
  it('should not touch strings other than "true" and "false"', () => {
    expect(convertedConfig.WEBSOCKET_ENDPOINT).toEqual('websocket-endpoint');
  });
});
