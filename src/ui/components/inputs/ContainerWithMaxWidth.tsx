import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const ContainerWithMaxWidth = styled(ViewGap)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: theme.contentPage.maxWidth,
}))
