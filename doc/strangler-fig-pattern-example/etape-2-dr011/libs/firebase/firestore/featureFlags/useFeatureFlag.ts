
// doc/strangler-fig-pattern-example/libs/firebase/firestore/featureFlags/useFeatureFlag.ts

import { RemoteStoreFeatureFlags } from '../types';

// Mock simple pour le feature flag. Pour l'exemple, il est toujours `false` au début.
// Il sera activé pour les étapes finales.
export const useFeatureFlag = (flag: RemoteStoreFeatureFlags): boolean => {
  // Pour l'illustration, on peut le changer manuellement ici ou via un mécanisme externe
  if (flag === RemoteStoreFeatureFlags.USE_MODERN_HOME_MODULE) {
    return false; // Sera mis à `true` pour les étapes de modernisation
  }
  return false;
};
