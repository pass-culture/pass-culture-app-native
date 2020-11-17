import React from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'
import styled from 'styled-components/native'

import { BusinessModule, ExclusivityModule, OffersModule } from 'features/home/components'
import {
  BusinessPane,
  ExclusivityPane,
  Offers,
  OffersWithCover,
  ProcessedModule,
} from 'features/home/contentful'
import { Spacer } from 'ui/theme'

interface HomeBodyProps {
  modules: ProcessedModule[]
  connected: boolean
  position: GeoCoordinates | null
}

export const HomeBody = function ({ modules, connected, position }: HomeBodyProps) {
  return (
    <Container>
      {modules.map((module: ProcessedModule) => {
        if (module instanceof Offers || module instanceof OffersWithCover) {
          return <OffersModule key={module.moduleId} {...module} position={position} />
        }
        if (module instanceof ExclusivityPane) {
          return <ExclusivityModule key={module.moduleId} {...module} />
        }
        if (module instanceof BusinessPane) {
          if (module.targetNotConnectedUsersOnly === undefined) {
            return <BusinessModule key={module.moduleId} {...module} />
          }
          if (module.targetNotConnectedUsersOnly && !connected) {
            return <BusinessModule key={module.moduleId} {...module} />
          }
          if (!module.targetNotConnectedUsersOnly && connected) {
            return <BusinessModule key={module.moduleId} {...module} />
          }
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
