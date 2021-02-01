import React from 'react'
import styled from 'styled-components/native'

import { BusinessModule, ExclusivityModule, OffersModule } from 'features/home/components'
import {
  BusinessPane,
  ExclusivityPane,
  OffersWithCover,
  ProcessedModule,
} from 'features/home/contentful'
import { useGeolocation } from 'libs/geolocation'
import { Spacer } from 'ui/theme'

import { useUserProfileInfo } from '../api'
import { AlgoliaModuleResponse } from '../pages/useHomeAlgoliaModules'
import { isOfferModuleTypeguard } from '../typeguards'

interface HomeBodyProps {
  modules: ProcessedModule[]
  algoliaModules: AlgoliaModuleResponse
}

export const HomeBody = function ({ modules, algoliaModules }: HomeBodyProps) {
  const { position } = useGeolocation()
  const { data: profile } = useUserProfileInfo()

  return (
    <Container>
      {modules
        .map((module: ProcessedModule, index: number) => {
          if (isOfferModuleTypeguard(module)) {
            const { hits, nbHits } = algoliaModules[module.moduleId]
            return (
              <OffersModule
                key={module.moduleId}
                algolia={module.algolia}
                display={module.display}
                isBeneficiary={profile?.isBeneficiary}
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
        })
        .map((children) => (
          <React.Fragment key={children?.key}>
            {children}
            <Spacer.Column numberOfSpaces={6} />
          </React.Fragment>
        ))}
      <Spacer.Column numberOfSpaces={6} />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  alignItems: 'flex-start',
})
