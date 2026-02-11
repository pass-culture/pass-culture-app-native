import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { PostOneReactionRequest, ReactionTypeEnum, SubcategoryIdEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { BookingsTab } from 'features/bookings/enum'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ReactionChoiceModalBodyWithRedirection } from 'features/reactions/components/ReactionChoiceModalBodyWithRedirection/ReactionChoiceModalBodyWithRedirection'
import { ReactionChoiceModalBodyWithValidation } from 'features/reactions/components/ReactionChoiceModalBodyWithValidation/ReactionChoiceModalBodyWithValidation'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { OfferImageBasicProps } from 'features/reactions/types'
import { analytics } from 'libs/analytics/provider'
import { AppModal } from 'ui/components/modals/AppModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Close } from 'ui/svg/icons/Close'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  offerId: number
  offerName: string
  subcategoryId: SubcategoryIdEnum
  dateUsed: string
  visible: boolean
  defaultReaction?: ReactionTypeEnum | null
  closeModal: (triggerUpdate?: boolean) => void
  from: ReactionFromEnum
  onSave?: ({ offerId, reactionType }: PostOneReactionRequest) => void
  bodyType: ReactionChoiceModalBodyEnum
  offerImages?: OfferImageBasicProps[]
  imageUrl?: string
}

export const ReactionChoiceModal: FunctionComponent<Props> = ({
  offerId,
  offerName,
  subcategoryId,
  dateUsed,
  visible,
  defaultReaction,
  closeModal,
  onSave,
  from,
  bodyType,
  offerImages,
  imageUrl,
}) => {
  const { height } = useWindowDimensions()
  const { top } = useCustomSafeInsets()
  const { navigate } = useNavigation<UseNavigationType>()
  const { user: profile } = useAuthContext()

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

  const onPressRedirection = () => {
    closeModal()
    navigate('Bookings', { activeTab: BookingsTab.COMPLETED })
  }

  const handleOnSave = () => {
    onSave?.({
      offerId,
      reactionType: reactionStatus,
    })

    void analytics.logValidateReaction({
      offerId,
      reactionType: reactionStatus,
      userId: profile?.id,
      from,
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
        bodyType === ReactionChoiceModalBodyEnum.VALIDATION ? (
          <Button wording={buttonWording} onPress={handleOnSave} disabled={isButtonDisabled} />
        ) : (
          <ButtonsContainer gap={4}>
            <Button wording="Donner mon avis" onPress={onPressRedirection} fullWidth />
            <Button
              wording="Plus tard"
              icon={ClockFilled}
              onPress={() => closeModal(true)}
              variant="tertiary"
              color="neutral"
              accessibilityLabel="Plus tard"
              fullWidth
            />
          </ButtonsContainer>
        )
      }>
      {bodyType === ReactionChoiceModalBodyEnum.VALIDATION ? (
        <ReactionChoiceModalBodyWithValidation
          subcategoryId={subcategoryId}
          imageUrl={imageUrl}
          offerName={offerName}
          dateUsed={dateUsed}
          reactionStatus={reactionStatus}
          handleOnPressReactionButton={onPressReactionButton}
        />
      ) : (
        <ReactionChoiceModalBodyWithRedirection offerImages={offerImages ?? []} />
      )}
    </AppModal>
  )
}

const ButtonsContainer = styled(ViewGap)(({ theme }) => ({
  alignItems: 'center',
  marginTop: theme.designSystem.size.spacing.s,
}))
