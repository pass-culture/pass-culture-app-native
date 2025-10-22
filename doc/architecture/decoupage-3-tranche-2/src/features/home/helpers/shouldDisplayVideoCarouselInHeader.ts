/* eslint-disable */
// @ts-nocheck
// prettier-ignore
import { HomepageModule, HomepageModuleType, ThematicHeader } from 'features/home/types';

export function shouldDisplayVideoCarouselInHeader(
  thematicHeader: ThematicHeader | undefined,
  enrichedModules: HomepageModule[]
): boolean {
  return !thematicHeader && enrichedModules[0]?.type === HomepageModuleType.VideoCarouselModule;
}