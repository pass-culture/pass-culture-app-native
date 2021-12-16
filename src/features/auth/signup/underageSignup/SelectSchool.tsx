import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { eligibleSchools, School } from 'features/auth/signup/underageSignup/eligibleSchools'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useSetIdCheckNavigationContext } from 'features/navigation/useSetIdCheckNavigationContext'
import { analytics } from 'libs/analytics'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { RadioButton } from 'ui/components/RadioButton'
import { Separator } from 'ui/components/Separator'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export const SelectSchool: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState({
    name: '',
    city: '',
    academy: '',
  })
  const [error, setError] = useState<Error | undefined>()
  const { navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation(setError)
  useSetIdCheckNavigationContext()

  const { navigate } = useNavigation<UseNavigationType>()

  const renderItem = (item: School, academy: string) => {
    return (
      <React.Fragment key={item.name}>
        <Spacer.Column numberOfSpaces={4} />
        <RadioButton
          id={item.name}
          title={item.name}
          description={item.city}
          onSelect={() => setSelectedSchool({ ...item, academy })}
          selectedValue={selectedSchool.name}
        />
        <Spacer.Column numberOfSpaces={4} />
        <Separator />
      </React.Fragment>
    )
  }

  const onPressContinue = () => {
    analytics.logSelectSchool(selectedSchool)
    navigateToNextBeneficiaryValidationStep()
  }

  if (error) {
    throw error
  }

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={18} />
      <Container>
        <TitleContainer>{t`Vois-tu ton établissement ?`}</TitleContainer>
        <Spacer.Column numberOfSpaces={6} />
        {Object.keys(eligibleSchools).map((academy) => (
          <React.Fragment key={academy}>
            <Divider />
            <AccordionItem title={t`Académie de` + '\u00a0' + academy}>
              {eligibleSchools[academy].map((item) => renderItem(item, academy))}
            </AccordionItem>
          </React.Fragment>
        ))}
      </Container>
      <BottomContainer>
        <ButtonPrimary
          title={t`Continuer`}
          disabled={!selectedSchool.name}
          onPress={onPressContinue}
        />
        <Spacer.Column numberOfSpaces={4} />
        <ButtonTertiaryBlack
          title={t`Je ne vois pas mon établissement`}
          icon={Invalidate}
          onPress={() => navigate('NotEligibleEduConnect')}
        />
      </BottomContainer>
      <Spacer.Column numberOfSpaces={4} />
      <PageHeader title={t`Établissements partenaires`} />
    </React.Fragment>
  )
}

const Container = styled.ScrollView(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
  flexDirection: 'column',
}))

const TitleContainer = styled(Typo.Title4)({
  textAlign: 'center',
})

const Divider = styled.View({
  height: getSpacing(2),
  backgroundColor: ColorsEnum.GREY_LIGHT,
})

const BottomContainer = styled.View({
  paddingHorizontal: getSpacing(5),
  paddingVertical: getSpacing(4),
  alignItems: 'center',
})
