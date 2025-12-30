import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { styled } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { StyledBodyXsSteps } from 'features/bonification/pages/BonificationNames'
import {
  legalRepresentativeActions,
  useLegalRepresentative,
} from 'features/bonification/store/legalRepresentativeStore'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { RadioSelector } from 'ui/components/radioSelector/RadioSelector'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export type Title = 'Madame' | 'Monsieur'

enum FormValues {
  MADAM = 'Madame',
  MISTER = 'Monsieur',
}

export const BonificationTitle = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const storedLegalRepresentative = useLegalRepresentative()
  const { setTitle: storeTitle } = legalRepresentativeActions

  const titleID = uuidv4()
  const titleLabel = 'Civilité'
  const [title, setTitle] = useState<Title | null>(storedLegalRepresentative.title ?? null)
  const disabled = !title

  const saveTitleAndNavigate = () => {
    if (title) storeTitle(title)
    navigate(...getSubscriptionHookConfig('BonificationBirthDate'))
  }
  return (
    <PageWithHeader
      title="Informations Personnelles"
      scrollChildren={
        <React.Fragment>
          <StyledBodyXsSteps>Étape 2 sur 5</StyledBodyXsSteps>
          <Typo.Title3 {...getHeadingAttrs(2)}>{'Quelle est sa civilité\u00a0?'}</Typo.Title3>
          <SelectorContainer
            gap={5}
            accessibilityRole={AccessibilityRole.RADIOGROUP}
            accessibilityLabelledBy={titleID}>
            <RadioSelector
              radioGroupLabel={titleLabel}
              label="Madame"
              checked={title === FormValues.MADAM}
              onPress={() => setTitle(FormValues.MADAM)}
            />
            <RadioSelector
              radioGroupLabel={titleLabel}
              label="Monsieur"
              checked={title === FormValues.MISTER}
              onPress={() => setTitle(FormValues.MISTER)}
            />
          </SelectorContainer>
        </React.Fragment>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          wording="Continuer"
          accessibilityLabel="Continuer vers la date de naissance"
          onPress={saveTitleAndNavigate}
          disabled={disabled}
        />
      }
    />
  )
}

const SelectorContainer = styled(ViewGap)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xl,
}))
