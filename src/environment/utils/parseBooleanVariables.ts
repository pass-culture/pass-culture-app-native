import { NativeConfig } from '@bam.tech/react-native-config';
import { Environment } from '..';

export const parseBooleanVariables = (config: NativeConfig): Environment => {
  const configWithActualBooleans = { ...config };

  Object.keys(config).map((key) => {
    if (config[key] === 'true') {
      configWithActualBooleans[key] = true;
    } else if (config[key] === 'false') {
      configWithActualBooleans[key] = false;
    }
  });

  return configWithActualBooleans as Environment;
};
