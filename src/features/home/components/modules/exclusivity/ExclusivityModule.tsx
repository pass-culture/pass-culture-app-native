import React, { memo } from 'react'
import { ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ExclusivityBanner } from 'features/home/components/modules/exclusivity/ExclusivityBanner'
import { ExclusivityExternalLink } from 'features/home/components/modules/exclusivity/ExclusivityExternalLink'
import { ExclusivityOffer } from 'features/home/components/modules/exclusivity/ExclusivityOffer'
import { ExclusivityModule as ExclusivityModuleType } from 'features/home/types'
import { getSpacing, Spacer } from 'ui/theme'

export interface ExclusivityModuleProps {
  title: string
  alt: string
  image: string
  moduleId: string
  offerId?: number
  display?: ExclusivityModuleType['displayParameters']
  url?: string
  homeEntryId: string | undefined
  index: number
  style?: ViewStyle
}

export type ExclusivityBannerProps = Omit<ExclusivityModuleProps, 'offerId' | 'url'>

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
  const StyledExclusivityComponent = styled(ExclusivityComponent)({
    marginBottom: getSpacing(6),
  })

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
