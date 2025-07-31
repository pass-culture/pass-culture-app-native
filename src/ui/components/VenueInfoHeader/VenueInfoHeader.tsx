import React, { FunctionComponent } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Image } from 'libs/resizing-image-on-demand/Image'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { RightFilled } from 'ui/svg/icons/RightFilled'

type VenueInfoHeaderProps = {
  imageSize: number
  title?: string
  subtitle?: string
  showArrow?: boolean
  imageURL?: string
  style?: StyleProp<ViewStyle>
}

export const VenueInfoHeader: FunctionComponent<VenueInfoHeaderProps> = ({
  title,
  imageSize,
  subtitle,
  showArrow = false,
  imageURL,
  style,
}) => {
  const { icons } = useTheme()
  return (
    <InfoHeader
      title={title}
      subtitle={subtitle}
      rightComponent={
        showArrow ? <RightFilled size={icons.sizes.extraSmall} testID="RightFilled" /> : null
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
      placeholderIcon={<LocationIcon testID="LocationIcon" />}
      style={style}
    />
  )
}

const VenueThumbnail = styled(Image)<{ height: number; width: number }>(({ height, width }) => ({
  borderRadius: 4,
  height,
  width,
}))

const LocationIcon = styled(LocationPointer).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
  color: theme.designSystem.color.icon.subtle,
}))``
