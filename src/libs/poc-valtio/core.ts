import AsyncStorage from '@react-native-async-storage/async-storage'

import { serviceRegistry } from './serviceRegistry'
import { services } from './services/_services'

type ServicesMap = typeof services
type ServiceName = keyof ServicesMap
type Service<T extends ServiceName> = ReturnType<ServicesMap[T]>

export interface Storage {
  getItem: (key: string) => Promise<any>
  setItem: (key: string, value: string) => Promise<void>
}

class LocalStorageAdapter implements Storage {
  async getItem(key: string) {
    return localStorage.getItem(key)
  }
  async setItem(key: string, value: string) {
    localStorage.setItem(key, value)
  }
}

class AsyncStorageAdapter implements Storage {
  async getItem(key: string) {
    return AsyncStorage.getItem(key)
  }
  async setItem<T>(key: string, value: string) {
    AsyncStorage.setItem(key, value)
  }
}

const reactCore = createCore({ storage: new LocalStorageAdapter() })
const reactNativeCore = createCore({ storage: new AsyncStorageAdapter() })

// <AppProvider core={reactCore}>
// <AppProvider core={reactNativeCore}>

interface Dependendencies {
  storage: Storage
}

export function createCore(dependencies?: Partial<Dependendencies>) {
  // Initialise tous les services
  const allServices = serviceRegistry.getAllServices()

  dependencies?.storage?.getItem('xavier')

  // Crée un objet qui expose directement les services
  const core = {} as { [K in ServiceName]: Service<K> }

  // Remplit l'objet core avec les services
  for (const [name, service] of allServices.entries()) {
    core[name as ServiceName] = service as Service<typeof name>
  }

  return core
}

// injection de dépendance
// virer le serviceRegistry si il sert à rien
// le refacto pour plus etre dependant de services
