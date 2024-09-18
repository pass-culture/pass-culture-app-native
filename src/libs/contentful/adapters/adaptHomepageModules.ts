import isEmpty from 'lodash/isEmpty'

import { HomepageModule } from 'features/home/types'
import { HomepageNatifModule } from 'libs/contentful/types'
import { eventMonitoring } from 'libs/monitoring'

import { ContentfulAdapterFactory } from './ContentfulAdapterFactory'

export const adaptHomepageNatifModules =
  (adapterFactory: ContentfulAdapterFactory) =>
  (modules: HomepageNatifModule[]): HomepageModule[] =>
    modules.filter(moduleContainFields).map(adaptModule(adapterFactory)).filter(isNotNull)

const adaptModule = (adapterFactory: ContentfulAdapterFactory) => (module: HomepageNatifModule) => {
  const contentType = module.sys.contentType?.sys.id || ''
  try {
    const adapter = adapterFactory.getAdapter(contentType)
    if (!adapter) {
      return null
    }
    return adapter(module)
  } catch (error) {
    monitorError(module)(error)
  }
  return null
}

const monitorError = (module: HomepageNatifModule) => (error: unknown) => {
  console.warn(`Error while computing home modules, with module of ID: ${module.sys.id}`, error)
  eventMonitoring.captureException('Error while computing home modules', {
    extra: { moduleId: module.sys.id },
  })
}

const moduleContainFields = ({ fields }: HomepageNatifModule) => fields || !isEmpty(fields)

const isNotNull = <T>(item: T | null): item is T => !!item
