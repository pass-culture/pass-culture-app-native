import React, { FunctionComponent, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { ReactionToggleButton } from 'features/reactions/components/ReactionToggleButton/ReactionToggleButton'
import { useSubcategory } from 'libs/subcategories'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Separator } from 'ui/components/Separator'
import { HorizontalTile } from 'ui/components/tiles/HorizontalTile'
import { ValidationMark } from 'ui/components/ValidationMark'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Close } from 'ui/svg/icons/Close'
import { ThumbDown } from 'ui/svg/icons/ThumbDown'
import { ThumbDownFilled } from 'ui/svg/icons/ThumbDownFilled'
import { ThumbUp } from 'ui/svg/icons/ThumbUp'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  offer: OfferResponse
  dateUsed: string
  visible: boolean
  closeModal: () => void
}

export const ReactionChoiceModal: FunctionComponent<Props> = ({
  offer,
  dateUsed,
  visible,
  closeModal,
}) => {
  const { height } = useWindowDimensions()
  const { top } = useCustomSafeInsets()
  const { categoryId } = useSubcategory(offer.subcategoryId)

  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [isDisliked, setIsDisliked] = useState<boolean>(false)

  const onPressReactionButton = (reaction: 'like' | 'dislike') => {
    setIsLiked(reaction === 'like' ? !isLiked : false)
    setIsDisliked(reaction === 'dislike' ? !isDisliked : false)
  }

  const handleCloseModal = () => {
    setIsLiked(false)
    setIsDisliked(false)
    closeModal()
  }

  return (
    <AppModal
      testID="reactionChoiceModal"
      visible={visible}
      title="Choix de réaction"
      maxHeight={height - top}
      rightIcon={Close}
      onRightIconPress={handleCloseModal}
      rightIconAccessibilityLabel="Fermer la modale"
      fixedModalBottom={
        <ButtonPrimary
          wording="Valider la réaction"
          onPress={() => {
            return
          }}
          disabled={!isLiked && !isDisliked}
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
            active={isLiked}
            label="J’aime"
            Icon={StyledThumbUp}
            FilledIcon={StyledThumbUpFilled}
            onPress={() => onPressReactionButton('like')}
          />
          <ReactionToggleButton
            active={isDisliked}
            label="Je n’aime pas"
            Icon={StyledThumbDown}
            FilledIcon={StyledThumbDownFilled}
            onPress={() => onPressReactionButton('dislike')}
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

const StyledThumbUp = styled(ThumbUp).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  testID: 'thumbUp',
}))``

const StyledThumbUpFilled = styled(ThumbUpFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  color: theme.colors.primary,
  testID: 'thumbUpFilled',
}))``

const StyledThumbDown = styled(ThumbDown).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  testID: 'thumbDown',
}))``

const StyledThumbDownFilled = styled(ThumbDownFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  testID: 'thumbDownFilled',
}))``
