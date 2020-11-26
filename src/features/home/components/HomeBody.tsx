import React from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { BusinessModule, ExclusivityModule, OffersModule } from 'features/home/components'
import {
  BusinessPane,
  ExclusivityPane,
  OffersWithCover,
  ProcessedModule,
} from 'features/home/contentful'
import { Spacer } from 'ui/theme'

import { useHomeAlgoliaModules } from '../pages/useHomeAlgoliaModules'

import { getModulesToDisplay, getOfferModules } from './HomeBody.utils'
import { isOfferModuleTypeguard } from './typeguards'

interface HomeBodyProps {
  modules: ProcessedModule[]
  position: GeoCoordinates | null
}

export const HomeBody = function ({ modules, position }: HomeBodyProps) {
  const { isLoggedIn } = useAuthContext()
  const algoliaModules = useHomeAlgoliaModules(getOfferModules(modules), position)
  const displayModules = getModulesToDisplay(modules, algoliaModules, isLoggedIn)

  return (
    <Container>
      {displayModules.map((module: ProcessedModule, index: number) => {
        if (isOfferModuleTypeguard(module)) {
          const { hits, nbHits } = algoliaModules[module.moduleId]
          return (
            <OffersModule
              key={module.moduleId}
              algolia={module.algolia}
              display={module.display}
              position={position}
              hits={hits}
              nbHits={nbHits}
              cover={module instanceof OffersWithCover ? module.cover : null}
              index={index}
            />
          )
        }
        if (module instanceof ExclusivityPane) {
          return <ExclusivityModule key={module.moduleId} {...module} />
        }
        if (module instanceof BusinessPane) {
          return <BusinessModule key={module.moduleId} {...module} />
        }
        return null
      })}
      <Spacer.Column numberOfSpaces={6} />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  alignItems: 'flex-start',
})
