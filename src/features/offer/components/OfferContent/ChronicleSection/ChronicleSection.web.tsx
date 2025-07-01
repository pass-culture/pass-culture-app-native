import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { ChronicleCardList } from 'features/chronicle/components/ChronicleCardList/ChronicleCardList'
import { CHRONICLE_CARD_WIDTH } from 'features/chronicle/constant'
import { ChronicleSectionBase } from 'features/offer/components/OfferContent/ChronicleSection/ChronicleSectionBase'
import { ButtonSecondaryBlack } from 'ui/components/buttons/ButtonSecondaryBlack'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Show } from 'ui/svg/icons/Show'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { ChronicleSectionProps } from './types'

export const ChronicleSection = (props: ChronicleSectionProps) => {
  const { isDesktopViewport } = useTheme()
  const {
    data,
    title,
    subtitle,
    ctaLabel,
    navigateTo,
    style,
    onSeeMoreButtonPress,
    chronicleIcon,
  } = props

  return isDesktopViewport ? (
    <View style={style}>
      <Gutter>
        <Row>
          <StyledTitle3 {...getHeadingAttrs(3)}>{title}</StyledTitle3>
          <InternalTouchableLink
            as={ButtonSecondaryBlack}
            icon={Show}
            wording={ctaLabel}
            navigateTo={navigateTo}
            // If i use styled-component in that case (i.e using "as" prop), i have an error in web :'(
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ width: 'auto', borderWidth: 0, paddingLeft: getSpacing(2) }}
          />
        </Row>
        {subtitle ? <StyledBodyAccentXs>{subtitle}</StyledBodyAccentXs> : null}
      </Gutter>
      <StyledChronicleCardlist
        data={data}
        onSeeMoreButtonPress={onSeeMoreButtonPress}
        shouldTruncate
        chronicleIcon={chronicleIcon}
      />
    </View>
  ) : (
    <ChronicleSectionBase {...props} />
  )
}

const StyledChronicleCardlist = styled(ChronicleCardList).attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingVertical: theme.contentPage.marginHorizontal,
  },
  cardWidth: CHRONICLE_CARD_WIDTH,
  snapToInterval: CHRONICLE_CARD_WIDTH,
}))``

const Gutter = styled.View(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))

const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })

const StyledTitle3 = styled(Typo.Title3)(({ theme }) => ({
  borderRightWidth: StyleSheet.hairlineWidth,
  borderRightColor: theme.designSystem.color.border.default,
  paddingRight: getSpacing(2),
}))

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
