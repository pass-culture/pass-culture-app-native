/* eslint-disable */
// @ts-nocheck
// prettier-ignore
// doc/strangler-fig-pattern-example/libs/firebase/firestore/featureFlags/useFeatureFlag.ts

import { RemoteStoreFeatureFlags } from '../types';

export const useFeatureFlag = (flag: RemoteStoreFeatureFlags): boolean => {
  if (flag === RemoteStoreFeatureFlags.USE_MODERN_HOME_MODULE) {
    return true; // Le feature flag est activé à 100%
  }
  return false;
};