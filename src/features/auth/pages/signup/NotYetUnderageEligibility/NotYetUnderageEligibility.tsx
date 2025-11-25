import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { FunctionComponent } from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'
import { formatToReadableFrenchDate } from 'libs/dates'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { CalendarIllustration } from 'ui/svg/icons/CalendarIllustration'

type Props = NativeStackScreenProps<RootStackParamList, 'NotYetUnderageEligibility'>

export const NotYetUnderageEligibility: FunctionComponent<Props> = (props) => {
  const formatedDate = formatToReadableFrenchDate(props.route.params.eligibilityStartDatetime)
  const NotYetUnderageEligibilityText = `Reviens à partir du ${formatedDate} pour poursuivre ton inscription et bénéficier des offres du pass Culture.`
  return (
    <GenericInfoPage
      illustration={CalendarIllustration}
      title="C’est pour bientôt&nbsp;!"
      subtitle={NotYetUnderageEligibilityText}
      buttonPrimary={{
        wording: 'Retourner à l’accueil',
        navigateTo: navigateToHomeConfig,
      }}
    />
  )
}
