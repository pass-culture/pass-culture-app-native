import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

export const ProfileContainer = styled.View({
  flex: 1,
  flexDirection: 'column',
  paddingHorizontal: getSpacing(5),
})

export const Separator = styled.View({
  width: '100%',
  height: 1,
  backgroundColor: ColorsEnum.GREY_LIGHT,
})

export const GreyContainer = styled.View({
  backgroundColor: ColorsEnum.GREY_LIGHT,
  borderRadius: 6,
  width: '100%',
})

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
