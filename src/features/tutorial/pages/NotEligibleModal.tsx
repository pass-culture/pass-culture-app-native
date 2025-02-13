import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { env } from 'libs/environment/env'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { BicolorBirthdayCake } from 'ui/svg/icons/BicolorBirthdayCake'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, TypoDS } from 'ui/theme'

type Props = {
  visible: boolean
  hideModal: () => void
  userStatus: NonEligible
  type: TutorialTypes
}

export const NotEligibleModal = ({ visible, userStatus, hideModal, type }: Props) => {
  const withFAQLink = type === TutorialTypes.ONBOARDING
  const { data: settings } = useSettingsContext()
  const enableCreditV3 = settings?.wipEnableCreditV3

  const onPress = useCallback(() => {
    openUrl(env.FAQ_LINK_CREDIT)
  }, [])

  const onButtonPress = () => {
    hideModal()
    if (type === TutorialTypes.PROFILE_TUTORIAL) navigateToHome()
  }

  if (
    (enableCreditV3 &&
      (userStatus === NonEligible.UNDER_15 || userStatus === NonEligible.UNDER_17)) ||
    (!enableCreditV3 && userStatus === NonEligible.UNDER_15)
  )
    return (
      <AppInformationModal
        visible={visible}
        title="Encore un peu de patience&nbsp;!"
        onCloseIconPress={hideModal}>
        <Spacer.Column numberOfSpaces={2} />
        <StyledIllustration />
        <Spacer.Column numberOfSpaces={4} />
        <StyledBody>
          {enableCreditV3
            ? 'Ton crédit t’attend à partir de tes 17 ans.'
            : 'Tu peux bénéficier de ton crédit sur l’application à partir de tes 15 ans.'}
        </StyledBody>
        {withFAQLink ? (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={4} />
            <ButtonTertiaryBlack
              wording="comment ça marche&nbsp;?"
              icon={ExternalSiteFilled}
              onPress={onPress}
            />
          </React.Fragment>
        ) : null}
        <Spacer.Column numberOfSpaces={4} />
        <StyledBody>
          En attendant, tu peux explorer le catalogue des offres et découvrir des lieux culturels
          autour de toi.
        </StyledBody>
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimary onPress={onButtonPress} wording="Explorer le catalogue" />
      </AppInformationModal>
    )
  return null
}

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})

const StyledIllustration = styled(BicolorBirthdayCake).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``
