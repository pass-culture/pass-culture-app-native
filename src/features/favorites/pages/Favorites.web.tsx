import { Link } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

// TODO WEB : delete this module and implement web version of this screen
export const Favorites = () => (
  <Page>
    <Text>Favorites</Text>
    <Link to={'/abtesting'}>
      <Text>Go to ABTestingPOC</Text>
    </Link>
    <Link to={'/search'}>
      <Text>Go to Search</Text>
    </Link>
  </Page>
)

const Page = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})
