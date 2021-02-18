import styled from 'styled-components/native'

import { ColorsEnum, getSpacing } from 'ui/theme'

export const ProfileContainer = styled.View({
  flex: 1,
  flexDirection: 'column',
  paddingHorizontal: getSpacing(5),
})

export const Separator = styled.View({
  width: '100%',
  height: 1,
  backgroundColor: ColorsEnum.GREY_LIGHT,
  marginTop: getSpacing(2),
})
