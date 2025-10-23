
// doc/strangler-fig-pattern-example/features/home/hooks/useTrackAllModulesSeen.ts

import { useCallback } from 'react';
import useFunctionOnce from '../../../libs/hooks/useFunctionOnce';
import { analytics } from '../../../libs/analytics'; // Import du mock
import { BatchEvent, BatchEventAttributes, BatchProfile } from '../../../libs/react-native-batch'; // Imports des mocks
import { ThematicHeader } from '../types';

// Mock pour createBatchEventAttributes
const createBatchEventAttributes = (homeId: string, thematicHeader: ThematicHeader | undefined) => {
  const attributes = new BatchEventAttributes();
  attributes.put('home_id', homeId);
  attributes.put(
    'home_type',
    thematicHeader ? `thematicHome - ${thematicHeader.type}` : 'mainHome'
  );
  return attributes;
};

export function useTrackAllModulesSeen(homeId: string, thematicHeader: ThematicHeader | undefined, modulesLength: number) {
  const track = useFunctionOnce(() => {
    analytics.logAllModulesSeen(modulesLength);
    const attributes = createBatchEventAttributes(homeId, thematicHeader);
    BatchProfile.trackEvent(BatchEvent.hasSeenAllTheHomepage, attributes);
  });
  return track;
}
