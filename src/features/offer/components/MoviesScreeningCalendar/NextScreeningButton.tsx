import React, { FC } from 'react'
import styled from 'styled-components/native'

import { extractDate } from 'features/offer/components/MovieCalendar/hooks/useMovieCalendarDay'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuaternarySecondary'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Typo } from 'ui/theme'

type Props = { onPress: () => void; date: Date }

export const NEXT_SCREENING_WORDING = 'Prochaine séance\u00a0:'

export const NextScreeningButton: FC<Props> = ({ onPress, date }) => {
  const { dayDate, fullWeekDay, fullMonth } = extractDate(date)

  return (
    <TouchableOpacity onPress={onPress}>
      <Container>
        <StyledInfoBanner message={<Typo.BodyXs>{NEXT_SCREENING_WORDING}</Typo.BodyXs>}>
          <ButtonQuaternarySecondary
            numberOfLines={1}
            icon={PlainArrowNext}
            wording={`${fullWeekDay} ${dayDate} ${fullMonth.toLocaleLowerCase()}`}
            inline
            fullWidth
            onPress={onPress}
          />
        </StyledInfoBanner>
      </Container>
    </TouchableOpacity>
  )
}

const Container = styled.View({
  width: '100%',
})

const StyledInfoBanner = styled(InfoBanner).attrs(({ theme }) => ({
  messageContainerStyle: { alignItems: 'center' },
  backgroundColor: theme.designSystem.color.background.subtle,
}))({})
