import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { Spacer } from 'ui/theme'

import { HeaderIcon } from '../atoms'

export const OfferHeader = () => {
  const { isLoggedIn } = useAuthContext()
  const { goBack } = useNavigation()

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <HeaderIcon iconName="back" onPress={goBack} />
      <RightIcons>
        <HeaderIcon iconName="share" onPress={() => null} />
        {isLoggedIn && (
          <React.Fragment>
            <Spacer.Row numberOfSpaces={3} />
            <HeaderIcon iconName="favorite" onPress={() => null} />
          </React.Fragment>
        )}
      </RightIcons>
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

const Row = styled.View({ flex: 1, flexDirection: 'row' })
const RightIcons = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'flex-end',
})
