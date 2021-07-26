import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

// TODO WEB : delete this module and implement web version of this screen
export const Profile = () => (
  <Page>
    <Text>
      Je suis la version web TEMPORAIRE de la page Profile. Je vais être supprimé dans le futur
      proche.
    </Text>
  </Page>
)

const Page = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})
