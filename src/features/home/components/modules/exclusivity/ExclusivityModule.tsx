import React, { memo } from 'react'
import { ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ExclusivityBanner } from 'features/home/components/modules/exclusivity/ExclusivityBanner'
import { ExclusivityExternalLink } from 'features/home/components/modules/exclusivity/ExclusivityExternalLink'
import { ExclusivityOffer } from 'features/home/components/modules/exclusivity/ExclusivityOffer'
import { ExclusivityModuleProps } from 'features/home/components/modules/exclusivity/types'
import { Spacer } from 'ui/theme'

const UnmemoizedExclusivityModule = ({ offerId, url, ...props }: ExclusivityModuleProps) => {
  const ExclusivityComponent = ({ style }: { style?: ViewStyle }) => {
    if (offerId !== undefined) {
      return <ExclusivityOffer offerId={offerId} {...props} style={style} />
    }

    if (url !== undefined) {
      return <ExclusivityExternalLink url={url} {...props} style={style} />
    }

    return <ExclusivityBanner {...props} style={style} />
  }
  const StyledExclusivityComponent = styled(ExclusivityComponent)(({ theme }) => ({
    marginBottom: theme.home.spaceBetweenModules,
  }))

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <StyledExclusivityComponent />
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

export const ExclusivityModule = memo(UnmemoizedExclusivityModule)

const Row = styled.View({
  flexDirection: 'row',
})
