import React from 'react'
import styled from 'styled-components/native'

import { extractDate } from 'features/offer/components/MovieCalendar/hooks/useMovieCalendarDay'
import { theme } from 'theme'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'

export const NextScreeningButton = ({ onPress, date }: { onPress?: () => void; date: Date }) => {
  const { dayDate, fullWeekDay, fullMonth } = extractDate(date)
  return (
    <Container onPress={onPress}>
      <InfoBanner message="Prochaine séance" backgroundColor={theme.colors.greyLight}>
        <ButtonQuaternarySecondary
          numberOfLines={1}
          icon={PlainArrowNext}
          wording={`${fullWeekDay} ${dayDate} ${fullMonth.toLocaleLowerCase()}`}
          inline
          fullWidth
        />
      </InfoBanner>
    </Container>
  )
}

const Container = styled.View({
  width: '100%',
  textAlign: 'center',
})
