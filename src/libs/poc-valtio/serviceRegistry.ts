import { services } from 'libs/poc-valtio/services/_services'

type ServicesMap = typeof services
type ServiceName = keyof ServicesMap

type ServiceFactory<T extends ServiceName> = ServicesMap[T]

type Service<T extends ServiceName = ServiceName> = ReturnType<ServiceFactory<T>>

export class ServiceRegistry {
  private static instance: ServiceRegistry
  private services: Map<ServiceName, Service> = new Map()
  private factories: Map<ServiceName, ServiceFactory<ServiceName>> = new Map()

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry()
    }
    return ServiceRegistry.instance
  }

  register<T extends ServiceName>(name: T, serviceFactory: ServiceFactory<T>): void {
    this.factories.set(name, serviceFactory)
  }

  get<T extends ServiceName>(name: T): Service<T> {
    let service = this.services.get(name)

    if (!service) {
      const factory = this.factories.get(name)
      if (!factory) {
        throw new Error(`Service ${name} not found in registry`)
      }
      service = factory(this.get.bind(this))
      this.services.set(name, service)
    }

    return service as Service<T>
  }

  getAllServices(): Map<ServiceName, Service> {
    // Initialise tous les services qui ne sont pas encore créés
    for (const [name] of this.factories) {
      if (!this.services.has(name)) {
        this.get(name)
      }
    }
    return this.services
  }
}

export const serviceRegistry = ServiceRegistry.getInstance()
