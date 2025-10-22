
/* eslint-disable */
// @ts-nocheck
// prettier-ignore
// doc/strangler-fig-pattern-example/features/home/core/shouldDisplayVideoCarouselInHeader.ts

import { HomepageModule, HomepageModuleType, ThematicHeader } from '../types';

export function shouldDisplayVideoCarouselInHeader(
  thematicHeader: ThematicHeader | undefined,
  enrichedModules: HomepageModule[]
): boolean {
  return !thematicHeader && enrichedModules[0]?.type === HomepageModuleType.VideoCarouselModule;
}
