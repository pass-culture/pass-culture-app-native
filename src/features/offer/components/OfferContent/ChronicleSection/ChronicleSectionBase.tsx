import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ChronicleCardList } from 'features/chronicle/components/ChronicleCardList/ChronicleCardList'
import { CHRONICLE_CARD_WIDTH } from 'features/chronicle/constant'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { ButtonSecondaryBlack } from 'ui/components/buttons/ButtonSecondaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { ChronicleSectionProps } from './types'

export const ChronicleSectionBase = ({
  data,
  variantInfo,
  ctaLabel,
  navigateTo,
  onSeeMoreButtonPress,
  onShowChroniclesWritersModal,
  style,
}: ChronicleSectionProps) => {
  return (
    <View style={style}>
      <Gutter>
        <Typo.Title3 {...getHeadingAttrs(3)}>{variantInfo.titleSection}</Typo.Title3>
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
      <Gutter>
        <InternalTouchableLink
          as={ButtonSecondaryBlack}
          wording={ctaLabel}
          navigateTo={navigateTo}
          // If i use styled-component in that case (i.e using "as" prop), i have an error in web :'(
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ alignSelf: 'center' }}
        />
      </Gutter>
      <Gutter>
        <StyledButtonQuaternaryBlack
          wording={variantInfo.modalTitle}
          icon={InfoPlain}
          onPress={onShowChroniclesWritersModal}
        />
      </Gutter>
    </View>
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

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledButtonQuaternaryBlack = styledButton(ButtonQuaternaryBlack)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))
