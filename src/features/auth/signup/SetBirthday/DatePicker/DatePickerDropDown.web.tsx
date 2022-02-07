import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { DropDown } from 'features/auth/signup/SetBirthday/DatePicker/DropDown.web'
import { SignupData } from 'features/auth/signup/types'
import { getPastYears, monthNames } from 'features/bookOffer/components/Calendar/Calendar.utils'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Spacer } from 'ui/theme'

interface Props {
  accessibilityLabelForNextStep?: string
  goToNextStep: (signupData: Partial<SignupData>) => void
}

const MINIMUM_DATE = 1900

export function DatePickerDropDown(props: Props) {
  const CURRENT_DATE = new Date()

  function goToNextStep() {
    const birthdate = formatDateToISOStringWithoutTime(new Date())
    props.goToNextStep({ birthdate })
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={2} />
      <DropDownContainer>
        <DropDown label="Mois" placeholder="MM" options={monthNames} />
        <Spacer.Row numberOfSpaces={2} />
        <DropDown label="Jour" placeholder="JJ" options={monthNames} />
        <Spacer.Row numberOfSpaces={2} />
        <DropDown
          label="Année"
          placeholder="AAAA"
          options={getPastYears(MINIMUM_DATE, CURRENT_DATE.getFullYear())}
        />
      </DropDownContainer>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording={t`Continuer`}
        accessibilityLabel={props.accessibilityLabelForNextStep}
        disabled={false}
        onPress={goToNextStep}
      />
      <Spacer.Column numberOfSpaces={2} />
    </React.Fragment>
  )
}

const DropDownContainer = styled.View({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
})
