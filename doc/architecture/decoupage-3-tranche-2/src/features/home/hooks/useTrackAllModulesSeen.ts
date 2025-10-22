/* eslint-disable */
// @ts-nocheck
// prettier-ignore
import { useCallback } from 'react';
import useFunctionOnce from 'libs/hooks/useFunctionOnce';
import { analytics } from 'libs/analytics/provider';
import { BatchEvent, BatchProfile } from 'libs/react-native-batch';
import { ThematicHeader } from 'features/home/types';
import { createBatchEventAttributes } from 'src/features/home/helpers/createBatchEventAttributes';

export function useTrackAllModulesSeen(homeId: string, thematicHeader: ThematicHeader | undefined, modulesLength: number) {
  const track = useFunctionOnce(() => {
    analytics.logAllModulesSeen(modulesLength);
    const attributes = createBatchEventAttributes(homeId, thematicHeader);
    BatchProfile.trackEvent(BatchEvent.hasSeenAllTheHomepage, attributes);
  });
  return track;
}