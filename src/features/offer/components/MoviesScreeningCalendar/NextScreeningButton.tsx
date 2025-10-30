import React, { FC } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { extractDate } from 'features/offer/components/MovieCalendar/hooks/useMovieCalendarDay'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Typo } from 'ui/theme'

type Props = { onPress: () => void; date: Date }

export const NEXT_SCREENING_WORDING = 'Prochaine séance\u00a0:'

export const NextScreeningButton: FC<Props> = ({ onPress, date }) => {
  const { dayDate, fullWeekDay, fullMonth } = extractDate(date)
  const { designSystem, icons } = useTheme()
  return (
    <TouchableOpacity onPress={onPress}>
      <Container>
        <Typo.BodyXs>{NEXT_SCREENING_WORDING}</Typo.BodyXs>
        <DateContainer>
          <PlainArrowNext
            color={designSystem.color.icon.brandSecondary}
            size={icons.sizes.extraSmall}
          />
          <StyledBodyAccentXs>{`${fullWeekDay} ${dayDate} ${fullMonth.toLocaleLowerCase()}`}</StyledBodyAccentXs>
        </DateContainer>
      </Container>
    </TouchableOpacity>
  )
}

const Container = styled.View(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  backgroundColor: theme.designSystem.color.background.subtle,
  borderRadius: theme.designSystem.size.borderRadius.m,
  padding: theme.designSystem.size.spacing.l,
}))

const DateContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.designSystem.size.spacing.s,
}))

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))
