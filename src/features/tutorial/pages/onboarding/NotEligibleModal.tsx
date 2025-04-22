import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers/openUrl'
import { NonEligible } from 'features/tutorial/enums'
import { env } from 'libs/environment/env'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { BicolorBirthdayCake } from 'ui/svg/icons/BicolorBirthdayCake'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  visible: boolean
  hideModal: () => void
  userStatus: NonEligible
}

export const NotEligibleModal = ({ visible, userStatus, hideModal }: Props) => {
  const onPress = useCallback(() => {
    openUrl(env.FAQ_LINK_CREDIT)
  }, [])

  const onButtonPress = () => {
    hideModal()
  }

  if (userStatus === NonEligible.UNDER_15)
    return (
      <AppInformationModal
        visible={visible}
        title="Encore un peu de patience&nbsp;!"
        onCloseIconPress={hideModal}>
        <Spacer.Column numberOfSpaces={2} />
        <StyledIllustration />
        <Spacer.Column numberOfSpaces={4} />
        <StyledBody>
          Tu peux bénéficier de ton crédit sur l’application à partir de tes 15 ans.
        </StyledBody>
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <ButtonTertiaryBlack
            wording="comment ça marche&nbsp;?"
            icon={ExternalSiteFilled}
            onPress={onPress}
          />
        </React.Fragment>
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

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const StyledIllustration = styled(BicolorBirthdayCake).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``
