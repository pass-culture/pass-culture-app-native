import { t } from '@lingui/macro'
import { getSpacing } from '@pass-culture/id-check'
import React from 'react'

import { DMSInformation } from 'features/identityCheck/atoms/DMSInformation'
import { IdentityVerificationText } from 'features/identityCheck/atoms/IdentityVerificationText'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { BicolorIdCardWithMagnifyingClass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingClass'
import { Spacer } from 'ui/theme'

export const IdentityCheckStart = () => {
  const { goBack } = useGoBack(...homeNavConfig)

  return (
    <PageWithHeader title={t`Identification`}>
      <Spacer.Column numberOfSpaces={6} />
      <BicolorIdCardWithMagnifyingClass size={getSpacing(36)} />
      <Spacer.Column numberOfSpaces={6} />
      <IdentityVerificationText />
      <Spacer.Column numberOfSpaces={6} />
      <DMSInformation />
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary onPress={goBack} title={t`Commencer la vérification`} />
    </PageWithHeader>
  )
}
