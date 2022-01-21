import styled from 'styled-components/native'

import { ColorsEnum } from 'ui/theme/colors'

export const Separator = styled.View<{ color?: ColorsEnum }>(({ color }) => ({
  width: '100%',
  height: 1,
  backgroundColor: color ?? ColorsEnum.GREY_LIGHT,
}))
