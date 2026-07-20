import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const ArtistHeaderWrapper = styled(ViewGap)(({ theme }) => ({
  alignItems: 'center',
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

export const ArtistNameContainer = styled(ViewGap)({
  alignItems: 'center',
})
