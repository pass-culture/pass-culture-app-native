import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { SubscriptionTheme } from 'features/subscription/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { RingingBellOff } from 'ui/svg/RingingBellOff'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  visible: boolean
  theme: SubscriptionTheme
  dismissModal: () => void
  onUnsubscribePress: () => void
}

export const UnsubscribingConfirmationModal: FunctionComponent<Props> = ({
  visible,
  theme,
  dismissModal,
  onUnsubscribePress,
}) => {
  return (
    <AppModalWithIllustration
      visible={visible}
      title="Es-tu sûr de ne plus vouloir suivre ce thème&nbsp;?"
      Illustration={StyledIcon}
      hideModal={dismissModal}>
      <StyledBody>
        {`Tu ne recevras plus toutes les dernières offres et l’actu liées au thème "${mapSubscriptionThemeToName[theme]}".`}
      </StyledBody>
      <StyledButtonContainer gap={2}>
        <ButtonPrimary wording="Ne plus suivre ce thème" onPress={onUnsubscribePress} />
        <ButtonTertiaryBlack wording="Annuler" icon={Invalidate} onPress={dismissModal} />
      </StyledButtonContainer>
    </AppModalWithIllustration>
  )
}

const StyledButtonContainer = styled(ViewGap)({
  width: '100%',
  marginTop: getSpacing(6),
  marginBottom: getSpacing(4),
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const StyledIcon = styled(RingingBellOff).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
  color: theme.designSystem.color.icon.brandPrimary,
}))``
