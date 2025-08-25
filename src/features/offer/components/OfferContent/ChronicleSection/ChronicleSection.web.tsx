import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { ChronicleCardList } from 'features/chronicle/components/ChronicleCardList/ChronicleCardList'
import { CHRONICLE_CARD_WIDTH } from 'features/chronicle/constant'
import { ChronicleSectionBase } from 'features/offer/components/OfferContent/ChronicleSection/ChronicleSectionBase'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { ButtonSecondaryBlack } from 'ui/components/buttons/ButtonSecondaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Show } from 'ui/svg/icons/Show'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { ChronicleSectionProps } from './types'

export const ChronicleSection = (props: ChronicleSectionProps) => {
  const { isDesktopViewport } = useTheme()
  const {
    data,
    variantInfo,
    ctaLabel,
    navigateTo,
    style,
    onSeeMoreButtonPress,
    onShowChroniclesWritersModal,
  } = props

  return (
    <React.Fragment>
      {isDesktopViewport ? (
        <View style={style}>
          <Gutter>
            <Row>
              <StyledTitle3 {...getHeadingAttrs(3)}>{variantInfo.titleSection}</StyledTitle3>
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
            {variantInfo.subtitleSection ? (
              <StyledBodyAccentXs>{variantInfo.subtitleSection}</StyledBodyAccentXs>
            ) : null}
          </Gutter>
          <StyledChronicleCardlist
            data={data}
            onSeeMoreButtonPress={onSeeMoreButtonPress}
            shouldTruncate
            cardIcon={variantInfo.Icon}
          />
          <StyledButtonQuaternaryBlack
            wording={variantInfo.modalTitle}
            icon={InfoPlain}
            onPress={onShowChroniclesWritersModal}
          />
        </View>
      ) : (
        <ChronicleSectionBase {...props} />
      )}
    </React.Fragment>
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
  paddingRight: theme.designSystem.size.spacing.s,
}))

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledButtonQuaternaryBlack = styledButton(ButtonQuaternaryBlack)(({ theme }) => ({
  width: getSpacing(42),
  marginLeft: theme.designSystem.size.spacing.xl,
  justifyContent: 'left',
}))
