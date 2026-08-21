import React from 'react'
import styled from 'styled-components/native'

import { CAPITALIZED_MONTHS } from 'shared/date/months'
import { Button } from 'ui/designSystem/Button/Button'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

type Props = {
  date: Date
  addMonth: (num: number) => void
}

export const MonthHeader: React.FC<Props> = ({ date, addMonth }) => {
  const month = `${CAPITALIZED_MONTHS[date.getMonth()]} ${date.getFullYear()}`

  return (
    <Container>
      <Button
        icon={ArrowPrevious}
        onPress={() => addMonth(-1)}
        iconButton
        accessibilityLabel="Mois précédent"
        variant="tertiary"
        color="neutral"
      />

      <Typo.Body {...setTextSemantic('h2')} accessibilityLiveRegion="polite">
        {month}
      </Typo.Body>

      <Button
        icon={ArrowNext}
        onPress={() => addMonth(1)}
        accessibilityLabel="Mois suivant"
        iconButton
        variant="tertiary"
        color="neutral"
      />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  paddingHorizontal: theme.designSystem.size.spacing.s,
}))

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
