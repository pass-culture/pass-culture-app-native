import { Link } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, Typo } from 'ui/theme'

// TODO WEB : delete this module and implement web version of this screen
export const Search = ({ title } = { title: 'Search Page' }) => (
  <Page>
    <Typo.Title3 color={ColorsEnum.PRIMARY}>{title}</Typo.Title3>
    <Link to={'/abtesting'}>
      <Text>Go to ABTestingPOC</Text>
    </Link>
    <Link to={'/login'}>
      <Text>Go to Login</Text>
    </Link>
    <Link to={'/eighteen'}>
      <Text>Go to EighteenBirthday</Text>
    </Link>
    <Link to={'/favorites'}>
      <Text>Go to TabNavigator/Favorites</Text>
    </Link>
  </Page>
)

const Page = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})
