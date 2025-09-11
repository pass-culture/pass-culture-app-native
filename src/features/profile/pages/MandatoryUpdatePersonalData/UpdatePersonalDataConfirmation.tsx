import React from 'react'

import { useNavigateToHomeWithReset } from 'features/navigation/helpers/useNavigateToHomeWithReset'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { HappyFace } from 'ui/svg/icons/HappyFace'

export const UpdatePersonalDataConfirmation = () => {
  const { navigateToHomeWithReset } = useNavigateToHomeWithReset()
  return (
    <GenericInfoPage
      illustration={HappyFace}
      title="C’est noté&nbsp;!"
      subtitle="Merci, tes informations ont bien été prises en compte."
      buttonPrimary={{
        wording: 'Terminer',
        onPress: navigateToHomeWithReset,
      }}
    />
  )
}
