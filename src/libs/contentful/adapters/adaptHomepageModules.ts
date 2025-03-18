import { isEmpty } from 'lodash'

import { HomepageModule } from 'features/home/types'
import { contentfulAdapters } from 'libs/contentful/adapters/contentfulAdapters'
import { HomepageNatifModule } from 'libs/contentful/types'
import { eventMonitoring } from 'libs/monitoring/services'

export const adaptHomepageNatifModules = (modules: HomepageNatifModule[]): HomepageModule[] =>
  modules.filter(moduleContainFields).map(adaptModule).filter(isNotNull)

const adaptModule = (module: HomepageNatifModule) => {
  const contentType = module.sys.contentType?.sys.id
  if (!contentType) {
    throw new Error(`Missing contentType`)
  }

  try {
    const adapter = contentfulAdapters[contentType]
    if (!adapter) {
      throw new Error(`Missing adapter for contentType: ${contentType}`)
    }
    return adapter(module)
  } catch (error) {
    monitorError(error, module)
  }
  return null
}

const monitorError = (error: unknown, module: HomepageNatifModule) => {
  console.warn(`Error while computing home modules, with module of ID: ${module.sys.id}`, error)
  eventMonitoring.captureException(error, {
    extra: { moduleId: module.sys.id },
  })
}

const moduleContainFields = ({ fields }: HomepageNatifModule) => fields || !isEmpty(fields)

const isNotNull = <T>(item: T | null): item is T => !!item
