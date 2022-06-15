import { t } from '@lingui/macro'
import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

export const SetPhoneNumber = () => {
  const { accessibilityRole } = useTheme()
  const titleID = uuidv4()

  return (
    <PageWithHeader
      title={t`Profil`}
      fixedTopChildren={
        <React.Fragment>
          <CenteredTitle titleID={titleID} title={t`Ton numéro de téléphone`} />
          <Spacer.Column numberOfSpaces={5} />
        </React.Fragment>
      }
      scrollChildren={
        <Form.MaxWidth>
          <View accessibilityRole={accessibilityRole.radiogroup} aria-labelledby={titleID}></View>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          onPress={() => {}}
          wording={t`Continuer`}
        />
      }
    />
  )
}
