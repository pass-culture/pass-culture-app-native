import React, { FunctionComponent, useCallback, useMemo } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { BookingOfferResponse, OfferResponse, ReactionTypeEnum } from 'api/gen'
import { ReactionToggleButton } from 'features/reactions/components/ReactionToggleButton/ReactionToggleButton'
import { useSubcategory } from 'libs/subcategories'
import { IconNames } from 'ui/components/icons/iconFactory'
import { useIconFactory } from 'ui/components/icons/useIconFactory'
import { Separator } from 'ui/components/Separator'
import { HorizontalTile } from 'ui/components/tiles/HorizontalTile'
import { ValidationMark } from 'ui/components/ValidationMark'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  offer: OfferResponse | BookingOfferResponse
  dateUsed: string
  handleOnPressReactionButton: (reactionType: ReactionTypeEnum) => void
  reactionStatus?: ReactionTypeEnum | null
}

export const ReactionChoiceModalBodyWithValidation: FunctionComponent<Props> = ({
  offer,
  dateUsed,
  reactionStatus,
  handleOnPressReactionButton,
}) => {
  const iconFactory = useIconFactory()
  const { categoryId } = useSubcategory(offer.subcategoryId)
  const theme = useTheme()

  const getStyledIcon = useCallback(
    (name: IconNames, props?: object) =>
      styled(iconFactory.getIcon(name)).attrs(({ theme }) => ({
        size: theme.icons.sizes.small,
        ...props,
      }))``,
    [iconFactory]
  )

  const ThumbUpIcon = useMemo(
    () => ({
      default: getStyledIcon('like', { testID: 'thumbUp' }),
      pressed: getStyledIcon('like-filled', {
        testID: 'thumbUpFilled',
        color: theme.colors.primary,
      }),
    }),
    [getStyledIcon, theme.colors.primary]
  )

  const ThumbDownIcon = useMemo(
    () => ({
      default: getStyledIcon('dislike', { testID: 'thumbDown' }),
      pressed: getStyledIcon('dislike-filled', {
        testID: 'thumbDownFilled',
      }),
    }),
    [getStyledIcon]
  )
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <ViewGap gap={6}>
        <Typo.Title3>Partage-nous ton avis&nbsp;!</Typo.Title3>
        <ViewGap gap={4}>
          <Separator.Horizontal />
          <HorizontalTileContainer gap={4}>
            <HorizontalTile title={offer.name} categoryId={categoryId} imageUrl={offer.image?.url}>
              <SubtitleContainer gap={1}>
                <ValidationMark isValid />
                <UsedText>Utilisé</UsedText>
                <DateUsedText>{dateUsed}</DateUsedText>
              </SubtitleContainer>
            </HorizontalTile>
          </HorizontalTileContainer>
          <Separator.Horizontal />
        </ViewGap>
        <ButtonsContainer gap={4}>
          <ReactionToggleButton
            active={reactionStatus === ReactionTypeEnum.LIKE}
            label="J’aime"
            Icon={ThumbUpIcon.default}
            FilledIcon={ThumbUpIcon.pressed}
            onPress={() => handleOnPressReactionButton(ReactionTypeEnum.LIKE)}
          />
          <ReactionToggleButton
            active={reactionStatus === ReactionTypeEnum.DISLIKE}
            label="Je n’aime pas"
            Icon={ThumbDownIcon.default}
            FilledIcon={ThumbDownIcon.pressed}
            onPress={() => handleOnPressReactionButton(ReactionTypeEnum.DISLIKE)}
          />
        </ButtonsContainer>
      </ViewGap>
    </React.Fragment>
  )
}

const HorizontalTileContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
})

const SubtitleContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
})

const UsedText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greenValid,
}))

const DateUsedText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const ButtonsContainer = styled(ViewGap)({
  flexDirection: 'row',
  marginBottom: getSpacing(12),
})
