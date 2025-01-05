import { serviceRegistry } from './serviceRegistry'
import { services } from './services/_services'

type ServicesMap = typeof services
type ServiceName = keyof ServicesMap
type ServicesType = { [K in ServiceName]: ReturnType<ServicesMap[K]> }

export function createCore() {
  Object.entries(services).forEach(([name, factory]) => {
    if (!serviceRegistry.hasFactory(name as ServiceName)) {
      serviceRegistry.register(name as ServiceName, factory)
    }
  })

  const allServices = serviceRegistry.getAllServices()
  const core = {} as { [K in ServiceName]: unknown }

  for (const [name, service] of allServices.entries()) {
    core[name as ServiceName] = service
  }

  return core as ServicesType
}
