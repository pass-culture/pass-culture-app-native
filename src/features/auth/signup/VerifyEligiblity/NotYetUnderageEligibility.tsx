import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { formatToReadableFrenchDate } from 'libs/dates'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { Calendar } from 'ui/svg/icons/Calendar'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'NotYetUnderageEligibility'>

export const NotYetUnderageEligibility: FunctionComponent<Props> = (props) => {
  return (
    <GenericInfoPage title={t`C'est pour bientôt ! `} icon={Calendar} iconSize={getSpacing(30)}>
      <StyledBody>
        {t({
          id: 'reviens a partir du',
          values: {
            formatedDate: formatToReadableFrenchDate(props.route.params.eligibilityStartDatetime),
          },
          message:
            'Reviens à partir du {formatedDate} pour poursuivre ton inscription et bénéficier des offres du pass Culture.',
        })}
      </StyledBody>
      <Spacer.Column numberOfSpaces={30} />
      <ButtonPrimaryWhite title={t`Retourner à l'accueil`} onPress={navigateToHome} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
