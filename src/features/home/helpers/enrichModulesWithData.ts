import { HomepageModule, ModuleData, isOffersModule, isVenuesModule } from 'features/home/types'

export function enrichModulesWithData(
  modules: HomepageModule[],
  offersData: ModuleData[],
  venuesData: ModuleData[]
): HomepageModule[] {
  return modules.map((module) => {
    if (isOffersModule(module)) {
      return {
        ...module,
        data: offersData.find((mod) => mod.moduleId === module.id),
      }
    }
    if (isVenuesModule(module)) {
      return {
        ...module,
        data: venuesData.find((mod) => mod.moduleId === module.id),
      }
    }
    return module
  })
}
