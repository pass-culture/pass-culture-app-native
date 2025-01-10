import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { Image } from 'libs/resizing-image-on-demand/Image'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { RightFilled } from 'ui/svg/icons/RightFilled'

type VenueInfoHeaderProps = {
  title: string
  imageSize: number
  subtitle?: string
  showArrow?: boolean
  imageURL?: string
}

export const VenueInfoHeader: FunctionComponent<VenueInfoHeaderProps> = ({
  title,
  imageSize,
  subtitle,
  showArrow = false,
  imageURL,
}) => {
  const theme = useTheme()
  return (
    <InfoHeader
      title={title}
      subtitle={subtitle}
      rightComponent={
        showArrow ? <RightFilled size={theme.icons.sizes.extraSmall} testID="RightFilled" /> : null
      }
      thumbnailComponent={
        imageURL ? (
          <VenueThumbnail
            url={imageURL}
            height={imageSize}
            width={imageSize}
            testID="VenuePreviewImage"
          />
        ) : null
      }
      defaultThumbnailSize={imageSize}
    />
  )
}

const VenueThumbnail = styled(Image)<{ height: number; width: number }>(({ height, width }) => ({
  borderRadius: 4,
  height,
  width,
}))
