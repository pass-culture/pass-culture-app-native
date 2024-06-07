import React, { memo, useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ExclusivityImage } from 'features/home/components/modules/exclusivity/ExclusivityImage'
import { ExclusivityBannerProps } from 'features/home/components/modules/exclusivity/ExclusivityModule'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'

const UnmemoizedExclusivityBanner = ({
  alt,
  image: imageURL,
  moduleId,
  homeEntryId,
  index,
  style,
}: ExclusivityBannerProps) => {
  useEffect(() => {
    analytics.logModuleDisplayedOnHomepage({
      moduleId,
      moduleType: ContentTypes.EXCLUSIVITY,
      index,
      homeEntryId,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, homeEntryId])

  return (
    <ImageContainer style={style} testID="exclusivity-banner">
      <ExclusivityImage imageURL={imageURL} alt={alt} />
    </ImageContainer>
  )
}

export const ExclusivityBanner = memo(UnmemoizedExclusivityBanner)

const ImageContainer = styled(View)({
  flex: 1,
})
