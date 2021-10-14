import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

export const ProfileContainer = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
  flexDirection: 'column',
  paddingHorizontal: getSpacing(5),
}))

export const GreyContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  borderRadius: 6,
  width: '100%',
}))

export const accordionStyle = StyleSheet.create({
  title: {
    paddingHorizontal: getSpacing(4),
    paddingBottom: getSpacing(4),
  },
  body: {
    paddingHorizontal: getSpacing(4),
    paddingBottom: getSpacing(4),
  },
})

export const Description = styled(Typo.Body)({
  textAlign: 'left',
})
