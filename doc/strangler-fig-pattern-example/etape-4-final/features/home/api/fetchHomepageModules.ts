
// doc/strangler-fig-pattern-example/features/home/api/fetchHomepageModules.ts

import { HomepageModule } from '../types';

// Fonction pour simuler la récupération de modules par page
// En réalité, cette fonction ferait un appel API paginé.
export const fetchHomepageModules = async (
  pageParam = 0,
  allModules: HomepageModule[]
): Promise<{ modules: HomepageModule[]; nextPage: number | undefined }> => {
  const pageSize = 3; // Nombre de modules par page pour l'exemple
  const start = pageParam * pageSize;
  const end = start + pageSize;
  const paginatedModules = allModules.slice(start, end);
  const nextPage = end < allModules.length ? pageParam + 1 : undefined;
  return { modules: paginatedModules, nextPage };
};
