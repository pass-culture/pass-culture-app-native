import React, { FC } from 'react'
import styled from 'styled-components/native'

import { extractDate } from 'features/offer/components/MovieCalendar/hooks/useMovieCalendarDay'
import { theme } from 'theme'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'

type Props = { onPress: () => void; date: Date }

export const NEXT_SCREENING_WORDING = 'Prochaine séance\u00a0:'

export const NextScreeningButton: FC<Props> = ({ onPress, date }) => {
  const { dayDate, fullWeekDay, fullMonth } = extractDate(date)

  return (
    <TouchableOpacity onPress={onPress}>
      <Container>
        <InfoBanner
          message={<StyledMessage>{NEXT_SCREENING_WORDING}</StyledMessage>}
          backgroundColor={theme.colors.greyLight}>
          <ButtonQuaternarySecondary
            numberOfLines={1}
            icon={PlainArrowNext}
            wording={`${fullWeekDay} ${dayDate} ${fullMonth.toLocaleLowerCase()}`}
            inline
            fullWidth
            onPress={onPress}
          />
        </InfoBanner>
      </Container>
    </TouchableOpacity>
  )
}

const Container = styled.View({
  width: '100%',
  textAlign: 'center',
})

const StyledMessage = styled.Text({
  textAlign: 'center',
})
