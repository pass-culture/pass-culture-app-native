import { serviceRegistry } from './serviceRegistry'
import { services } from './services/_services'

type ServicesMap = typeof services
type ServiceName = keyof ServicesMap
type Service<T extends ServiceName> = ReturnType<ServicesMap[T]>
type ServicesType = { [K in ServiceName]: Service<K> }

export function createCore(): ServicesType {
  Object.entries(services).forEach(([name, factory]) => {
    if (!serviceRegistry.hasFactory(name as ServiceName)) {
      serviceRegistry.register(name as ServiceName, factory)
    }
  })

  const allServices = serviceRegistry.getAllServices()

  const core = {} as ServicesType

  for (const [name, service] of allServices.entries()) {
    // @ts-ignore cannot type this for the moment
    core[name] = service as Service<typeof name>
  }

  return core
}

// faire les hooks
// utiliser zustand
