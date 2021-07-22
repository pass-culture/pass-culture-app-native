import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { testID } from 'tests/utils'
import { Spacer, Typo } from 'ui/theme'

import { useVenue } from '../api/useVenue'

export const Venue: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Venue'>>()
  const { data: venue } = useVenue(params.id)

  if (!venue) return <React.Fragment></React.Fragment>

  return (
    <Container {...testID('Page de détail du lieu')}>
      <Spacer.TopScreen />
      <Typo.Caption>{venue.id}</Typo.Caption>
      <Typo.Caption>{venue.name}</Typo.Caption>
    </Container>
  )
}

const Container = styled.ScrollView({})
