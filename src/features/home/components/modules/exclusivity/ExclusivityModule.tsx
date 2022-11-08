import React, { memo } from 'react'
import styled from 'styled-components/native'

import { ExclusivityBanner } from 'features/home/components/modules/exclusivity/ExclusivityBanner'
import { ExclusivityExternalLink } from 'features/home/components/modules/exclusivity/ExclusivityExternalLink'
import { ExclusivityOffer } from 'features/home/components/modules/exclusivity/ExclusivityOffer'
import { ExclusivityPane } from 'features/home/contentful'
import { getSpacing, Spacer } from 'ui/theme'

export interface ExclusivityModuleProps extends ExclusivityPane {
  homeEntryId: string | undefined
  index: number
}

export type ExclusivityBannerProps = Omit<ExclusivityModuleProps, 'offerId' | 'url'>

const UnmemoizedExclusivityModule = ({ offerId, url, ...props }: ExclusivityModuleProps) => {
  const ExclusivityComponent = () => {
    if (offerId !== undefined) {
      return <ExclusivityOffer offerId={offerId} {...props} />
    }

    if (url !== undefined) {
      return <ExclusivityExternalLink url={url} {...props} />
    }

    return <ExclusivityBanner {...props} />
  }

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <ExclusivityComponent />
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

export const ExclusivityModule = memo(UnmemoizedExclusivityModule)

const Row = styled.View({
  flexDirection: 'row',
  paddingBottom: getSpacing(6),
})
