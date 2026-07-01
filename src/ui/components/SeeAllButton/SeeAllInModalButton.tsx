import React from 'react'

import { SeeAllButtonWrapper } from 'ui/components/SeeAllButton/SeeAllButtonWrapper'
import { Button } from 'ui/designSystem/Button/Button'

type Props = {
  title: string
  onPress: () => void
}

export const SeeAllInModalButton = ({ title, onPress }: Props) => {
  const accessibilityLabel = `Voir tout pour la sélection ${title}`

  return (
    <SeeAllButtonWrapper>
      <Button
        variant="tertiary"
        wording="Voir tout"
        size="small"
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
      />
    </SeeAllButtonWrapper>
  )
}
