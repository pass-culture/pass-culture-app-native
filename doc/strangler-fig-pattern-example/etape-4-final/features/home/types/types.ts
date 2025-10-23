
// doc/strangler-fig-pattern-example/features/home/types.ts

export enum HomepageModuleType {
  OffersModule = 'OffersModule',
  VenuesModule = 'VenuesModule',
  VideoCarouselModule = 'VideoCarouselModule',
}

export interface HomepageModule {
  id: string;
  type: HomepageModuleType;
  title?: string;
  data?: any; // Simplifié
}

export interface ThematicHeader {
  type: string;
  title: string;
}

export const isOffersModule = (module: HomepageModule): boolean => module.type === HomepageModuleType.OffersModule;
export const isVenuesModule = (module: HomepageModule): boolean => module.type === HomepageModuleType.VenuesModule;
export const isVideoCarouselModule = (module: HomepageModule): boolean => module.type === HomepageModuleType.VideoCarouselModule;
