import React, { memo } from 'react'
import styled from 'styled-components/native'

import { ExclusivityBanner } from 'features/home/components/modules/exclusivity/ExclusivityBanner'
import { ExclusivityOffer } from 'features/home/components/modules/exclusivity/ExclusivityOffer'
import { ExclusivityPane } from 'features/home/contentful'
import { getSpacing, Spacer } from 'ui/theme'

export interface ExclusivityModuleProps extends ExclusivityPane {
  homeEntryId: string | undefined
  index: number
}

const UnmemoizedExclusivityModule = ({
  title,
  alt,
  image: imageURL,
  offerId,
  moduleId,
  display,
  homeEntryId,
  index,
}: ExclusivityModuleProps) => {
  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      {offerId === undefined ? (
        <ExclusivityBanner
          moduleId={moduleId}
          title={title}
          alt={alt}
          image={imageURL}
          display={display}
          homeEntryId={homeEntryId}
          index={index}
        />
      ) : (
        <ExclusivityOffer
          moduleId={moduleId}
          title={title}
          alt={alt}
          image={imageURL}
          offerId={offerId}
          display={display}
          homeEntryId={homeEntryId}
          index={index}
        />
      )}
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

export const ExclusivityModule = memo(UnmemoizedExclusivityModule)

const Row = styled.View({
  flexDirection: 'row',
  paddingBottom: getSpacing(6),
})
