import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { BookingOfferResponse, OfferResponse, PostReactionRequest, ReactionTypeEnum } from 'api/gen'
import { ReactionToggleButton } from 'features/reactions/components/ReactionToggleButton/ReactionToggleButton'
import { ReactionFromEnum } from 'features/reactions/enum'
import { useSubcategory } from 'libs/subcategories'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { IconNames } from 'ui/components/icons/iconFactory'
import { useIconFactory } from 'ui/components/icons/useIconFactory'
import { AppModal } from 'ui/components/modals/AppModal'
import { Separator } from 'ui/components/Separator'
import { HorizontalTile } from 'ui/components/tiles/HorizontalTile'
import { ValidationMark } from 'ui/components/ValidationMark'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  offer: OfferResponse | BookingOfferResponse
  dateUsed: string
  visible: boolean
  defaultReaction?: ReactionTypeEnum | null
  closeModal: () => void
  onSave?: ({ offerId, reactionType }: PostReactionRequest) => void
  from: ReactionFromEnum
}

export const ReactionChoiceModal: FunctionComponent<Props> = ({
  offer,
  dateUsed,
  visible,
  defaultReaction,
  closeModal,
  onSave,
  from,
}) => {
  const { height } = useWindowDimensions()
  const { top } = useCustomSafeInsets()
  const iconFactory = useIconFactory()
  const { categoryId } = useSubcategory(offer.subcategoryId)
  const theme = useTheme()

  const [reactionStatus, setReactionStatus] = useState<ReactionTypeEnum>(
    ReactionTypeEnum.NO_REACTION
  )
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true)
  const [buttonWording, setButtonWording] = useState<string>('Valider la réaction')

  const onPressReactionButton = (reactionType: ReactionTypeEnum) => {
    setIsButtonDisabled(false)
    setButtonWording('Valider la réaction')
    setReactionStatus((previousValue) => {
      if (reactionType === previousValue && from === ReactionFromEnum.HOME)
        setIsButtonDisabled(true)
      return reactionType === previousValue ? ReactionTypeEnum.NO_REACTION : reactionType
    })
  }

  useEffect(() => {
    if (visible && defaultReaction !== undefined && defaultReaction !== null) {
      setReactionStatus(defaultReaction)
      setIsButtonDisabled(true)
      setButtonWording('Valider la réaction')
    }
  }, [visible, defaultReaction])

  useEffect(() => {
    if (
      !isButtonDisabled &&
      reactionStatus === ReactionTypeEnum.NO_REACTION &&
      from === ReactionFromEnum.ENDED_BOOKING
    ) {
      setButtonWording('Confirmer')
    }
  }, [reactionStatus, isButtonDisabled, from])

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
    <AppModal
      testID="reactionChoiceModal"
      visible={visible}
      title="Choix de réaction"
      maxHeight={height - top}
      rightIcon={Close}
      onRightIconPress={closeModal}
      rightIconAccessibilityLabel="Fermer la modale"
      fixedModalBottom={
        <ButtonPrimary
          wording={buttonWording}
          onPress={() => {
            onSave?.({
              offerId: offer.id,
              reactionType: reactionStatus,
            })
          }}
          disabled={isButtonDisabled}
        />
      }>
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
            onPress={() => onPressReactionButton(ReactionTypeEnum.LIKE)}
          />
          <ReactionToggleButton
            active={reactionStatus === ReactionTypeEnum.DISLIKE}
            label="Je n’aime pas"
            Icon={ThumbDownIcon.default}
            FilledIcon={ThumbDownIcon.pressed}
            onPress={() => onPressReactionButton(ReactionTypeEnum.DISLIKE)}
          />
        </ButtonsContainer>
      </ViewGap>
    </AppModal>
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
