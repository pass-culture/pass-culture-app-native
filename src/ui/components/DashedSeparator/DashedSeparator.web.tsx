import styled from 'styled-components/native'

import { ColorsEnum } from 'ui/theme/colors'

export const DashedSeparator = styled.View({
  borderBottomColor: ColorsEnum.BLACK,
  borderBottomWidth: 1,
  borderBottomStyle: 'dashed',
  borderRadius: 100,
  overflow: 'hidden',
  width: '100%',
  alignSelf: 'center',
})
