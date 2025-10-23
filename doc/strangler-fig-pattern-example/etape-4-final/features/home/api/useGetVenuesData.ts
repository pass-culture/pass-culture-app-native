
// doc/strangler-fig-pattern-example/features/home/api/useGetVenuesData.ts

import { HomepageModule } from '../types';

export const useGetVenuesData = (modules: HomepageModule[]) => {
  // Simule la récupération de données legacy
  return { venuesModulesData: { data: modules.map(m => ({ id: m.id, name: `Legacy Venue for ${m.title}` })) } };
};
