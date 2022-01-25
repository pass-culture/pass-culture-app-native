import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { formatToReadableFrenchDate } from 'libs/dates'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { CalendarIllustration } from 'ui/svg/icons/CalendarIllustration'
import { Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type Props = StackScreenProps<RootStackParamList, 'NotYetUnderageEligibility'>

export const NotYetUnderageEligibility: FunctionComponent<Props> = (props) => {
  return (
    <GenericInfoPage
      title={t`C'est pour bientôt\u00a0!`}
      icon={CalendarIllustration}
      buttons={[
        <ButtonPrimaryWhite key={1} title={t`Retourner à l'accueil`} onPress={navigateToHome} />,
      ]}>
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
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
