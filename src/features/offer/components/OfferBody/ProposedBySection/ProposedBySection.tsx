import React, { Fragment, FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled, { useTheme } from 'styled-components/native'

import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalTouchableLinkProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { Venue } from 'ui/svg/icons/Venue'
import { Typo } from 'ui/theme'
import { AVATAR_SMALL } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type ProposedBySectionProps = {
  name: string
  navigateTo: InternalTouchableLinkProps['navigateTo']
  imageUrl?: string | null
}

export const ProposedBySection: FunctionComponent<ProposedBySectionProps> = ({
  name,
  imageUrl,
  navigateTo,
}) => {
  const theme = useTheme()

  const Wrapper = theme.isDesktopViewport ? Fragment : StyledSectionWithDivider

  return (
    <Wrapper>
      <InternalTouchableLink navigateTo={navigateTo} hoverUnderlineColor={theme.colors.white}>
        <ViewGap gap={4}>
          <Typo.Title3 {...getHeadingAttrs(2)}>Proposé par</Typo.Title3>
          <InfoHeader
            title={name}
            rightComponent={
              <RightFilled size={theme.icons.sizes.extraSmall} testID="RightFilled" />
            }
            defaultThumbnailSize={AVATAR_SMALL}
            thumbnailComponent={
              <Avatar borderWidth={3} size={AVATAR_SMALL}>
                {imageUrl ? (
                  <FullSizeImage url={imageUrl} testID="VenueImage" />
                ) : (
                  <DefaultVenueAvatar testID="DefaultImage" />
                )}
              </Avatar>
            }
          />
        </ViewGap>
      </InternalTouchableLink>
    </Wrapper>
  )
}

const StyledSectionWithDivider = styled(SectionWithDivider).attrs({
  visible: true,
  margin: true,
  gap: 8,
})({})

const FullSizeImage = styled(FastImage)({
  width: '100%',
  height: '100%',
})

const DefaultVenueAvatar = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [theme.colors.secondary, theme.colors.primary],
  useAngle: true,
  angle: -30,
  children: <Venue color={theme.colors.white} size={29} />,
}))({ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' })
