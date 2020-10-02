import Config from '@bam.tech/react-native-config';
import { parseBooleanVariables } from './parseBooleanVariables';

export interface Environment {
  ENV: string;
  API_ENDPOINT: string;
  WEBSOCKET_ENDPOINT: string;
  FEATURE_FLAG_CHEAT_CODES: boolean;
  FEATURE_FLAG_CODE_PUSH: boolean;
  FEATURE_FLAG_CODE_PUSH_MANUAL: boolean;
}

export const env = parseBooleanVariables(Config) as Environment;
