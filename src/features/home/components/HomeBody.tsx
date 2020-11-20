import React from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
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
  position: GeoCoordinates | null
}

export const showBusinessModule = (
  targetNotConnectedUsersOnly: boolean | undefined,
  connected: boolean
): boolean => {
  // Target both type of users
  if (targetNotConnectedUsersOnly === undefined) return true

  // Target only NON connected users
  if (!connected && targetNotConnectedUsersOnly) return true

  // Target only connected users
  if (connected && !targetNotConnectedUsersOnly) return true
  return false
}

export const HomeBody = function ({ modules, position }: HomeBodyProps) {
  const { loggedIn } = useAuthContext()
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
          if (showBusinessModule(module.targetNotConnectedUsersOnly, loggedIn)) {
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
