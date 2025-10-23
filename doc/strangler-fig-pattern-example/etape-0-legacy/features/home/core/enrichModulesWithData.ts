
// doc/strangler-fig-pattern-example/features/home/core/enrichModulesWithData.ts

import { HomepageModule } from '../types';

// Fonction simplifiée pour l'exemple
export const enrichModulesWithData = (modules: HomepageModule[], offersData: any, venuesData: any): HomepageModule[] => {
  return modules.map(module => ({
    ...module,
    data: `Enriched data for ${module.title || module.id}` // Juste pour montrer l'enrichissement
  }));
};
