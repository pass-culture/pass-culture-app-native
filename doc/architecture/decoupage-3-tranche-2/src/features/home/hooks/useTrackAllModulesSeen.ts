import { useCallback } from 'react';
import useFunctionOnce from 'libs/hooks/useFunctionOnce';
import { analytics } from 'libs/analytics/provider';
import { BatchEvent, BatchEventAttributes, BatchProfile } from 'libs/react-native-batch';
import { ThematicHeader } from 'features/home/types';

export function useTrackAllModulesSeen(homeId: string, thematicHeader: ThematicHeader | undefined, modulesLength: number) {
  const track = useFunctionOnce(() => {
    analytics.logAllModulesSeen(modulesLength);
    const attributes = new BatchEventAttributes();
    attributes.put('home_id', homeId);
    attributes.put(
      'home_type',
      thematicHeader ? `thematicHome - ${thematicHeader.type}` : 'mainHome'
    );
    BatchProfile.trackEvent(BatchEvent.hasSeenAllTheHomepage, attributes);
  });
  return track;
}