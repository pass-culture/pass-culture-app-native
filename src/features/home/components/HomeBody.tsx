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
import { SearchHit } from 'libs/search'
import { Spacer } from 'ui/theme'

import { useUserProfileInfo } from '../api'
import { RecommendationPane } from '../contentful/moduleTypes'
import { HomeModuleResponse } from '../pages/useHomeModules'
import { isOfferModuleTypeguard } from '../typeguards'

import { RecommendationModule } from './RecommendationModule'

interface HomeBodyProps {
  modules: ProcessedModule[]
  homeModules: HomeModuleResponse
  recommendedHits: SearchHit[]
  setRecommendationY: (y: number) => void
}

export const HomeBody = (props: HomeBodyProps) => {
  const { modules, homeModules, recommendedHits, setRecommendationY } = props
  const { position } = useGeolocation()
  const { data: profile } = useUserProfileInfo()

  return (
    <Container>
      {modules
        .map((module: ProcessedModule, index: number) => {
          if (isOfferModuleTypeguard(module)) {
            const { hits, nbHits } = homeModules[module.moduleId]
            return (
              <OffersModule
                key={module.moduleId}
                algolia={module.algolia[0]}
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
          if (module instanceof RecommendationPane) {
            return (
              <RecommendationModule
                key="recommendation"
                isBeneficiary={profile?.isBeneficiary}
                hits={recommendedHits}
                position={position}
                index={index}
                setRecommendationY={setRecommendationY}
                {...module}
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
