
/* eslint-disable */
// @ts-nocheck
// prettier-ignore
// doc/strangler-fig-pattern-example/features/home/queries/useGetOffersDataQuery.ts

import { HomepageModule } from '../types';

export const useGetOffersDataQuery = (modules: HomepageModule[]) => {
  // Simule la récupération de données legacy
  return { data: modules.map(m => ({ id: m.id, title: `Legacy Offer for ${m.title}` })) };
};
