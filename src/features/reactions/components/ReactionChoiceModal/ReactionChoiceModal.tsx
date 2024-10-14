import React, { FunctionComponent, useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import {
  BookingOfferResponse,
  OfferResponse,
  PostOneReactionRequest,
  ReactionTypeEnum,
} from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { ReactionChoiceValidation } from 'features/reactions/components/ReactionChoiceValidation/ReactionChoiceValidation'
import { ReactionFromEnum } from 'features/reactions/enum'
import { analytics } from 'libs/analytics'
import { useSubcategory } from 'libs/subcategories'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
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
  closeModal: (triggerUpdate?: boolean) => void
  from: ReactionFromEnum
  onSave?: ({ offerId, reactionType }: PostOneReactionRequest) => void
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
  const { user: profile } = useAuthContext()
  const { categoryId } = useSubcategory(offer.subcategoryId)

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

  const handleOnSave = () => {
    onSave?.({
      offerId: offer.id,
      reactionType: reactionStatus,
    })
    analytics.logValidateReaction({
      offerId: offer.id,
      reactionType: reactionStatus,
      userId: profile?.id,
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

  return (
    <AppModal
      testID="reactionChoiceModal"
      visible={visible}
      title="Choix de réaction"
      maxHeight={height - top}
      rightIcon={Close}
      onRightIconPress={() => closeModal(true)}
      rightIconAccessibilityLabel="Fermer la modale"
      fixedModalBottom={
        <ButtonPrimary wording={buttonWording} onPress={handleOnSave} disabled={isButtonDisabled} />
      }>
      <React.Fragment>
        <Spacer.Column numberOfSpaces={6} />
        <ViewGap gap={6}>
          <Typo.Title3>Partage-nous ton avis&nbsp;!</Typo.Title3>
          <ViewGap gap={4}>
            <Separator.Horizontal />
            <HorizontalTileContainer gap={4}>
              <HorizontalTile
                title={offer.name}
                categoryId={categoryId}
                imageUrl={offer.image?.url}>
                <SubtitleContainer gap={1}>
                  <ValidationMark isValid />
                  <UsedText>Utilisé</UsedText>
                  <DateUsedText>{dateUsed}</DateUsedText>
                </SubtitleContainer>
              </HorizontalTile>
            </HorizontalTileContainer>
            <Separator.Horizontal />
          </ViewGap>
          <StyledReactionChoiceValidation
            reactionStatus={reactionStatus}
            handleOnPressReactionButton={onPressReactionButton}
          />
        </ViewGap>
      </React.Fragment>
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

const StyledReactionChoiceValidation = styled(ReactionChoiceValidation)({
  marginBottom: getSpacing(12),
})
