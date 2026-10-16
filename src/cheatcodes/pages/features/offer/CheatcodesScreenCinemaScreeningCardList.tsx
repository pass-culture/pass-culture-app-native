import React, { useState } from 'react'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { getCheatcodesHookConfig } from 'features/navigation/navigators/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { CinemaScreeningCardList } from 'features/offer/components/CinemaScreeningCard/CinemaScreeningCardList'
import {
  CinemaScreeningCardDisabledReason,
  CinemaScreeningCardProps,
} from 'features/offer/components/CinemaScreeningCard/types'
import { Currency, useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { Button } from 'ui/designSystem/Button/Button'
import { Typo } from 'ui/theme'

type Day = 1 | 2

const onPress = () => undefined

const createScreening = (
  time: string,
  currency: Currency,
  props: Partial<CinemaScreeningCardProps> = {}
): CinemaScreeningCardProps => ({
  time,
  languages: ['VO'],
  price: `25\u00a0${currency}`,
  onPress,
  ...props,
})

const createCompleteScreening = (time: string, currency: Currency) =>
  createScreening(time, currency, {
    specialEvent: 'Avant-première équipe',
    video: ['DolbyVision'],
    audio: ['Auro3D'],
    accessibility: {
      visual: ['value'],
      audio: ['GRETA'],
      mental: ['value'],
      motor: ['value'],
    },
  })

const getScreeningsByDay = (currency: Currency): Record<Day, CinemaScreeningCardProps[]> => ({
  1: [
    createScreening('10h', currency),
    createScreening('11h', currency, { specialEvent: 'Avant-première équipe' }),
    createScreening('13h', currency, { video: ['DolbyVision'], audio: ['Auro3D'] }),
    createScreening('15h', currency, { accessibility: { visual: ['value'] } }),
    createScreening('17h', currency, {
      disabledReason: CinemaScreeningCardDisabledReason.UNAVAILABLE,
    }),
    createScreening('18h', currency),
    createCompleteScreening('19h', currency),
  ],
  2: [
    createScreening('9h', currency),
    createScreening('12h', currency),
    createScreening('14h', currency, { accessibility: { audio: ['GRETA'] } }),
    createScreening('16h', currency, { specialEvent: 'Avant-première équipe' }),
    createScreening('17h30', currency, {
      disabledReason: CinemaScreeningCardDisabledReason.INSUFFICIENT_CREDIT,
    }),
    createScreening('18h30', currency),
    createCompleteScreening('19h', currency),
  ],
})

export function CheatcodesScreenCinemaScreeningCardList(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))
  const currency = useGetCurrencyToDisplay()
  const [day, setDay] = useState<Day>(1)
  const screenings = getScreeningsByDay(currency)[day]

  const toggleDay = () => setDay((currentDay) => (currentDay === 1 ? 2 : 1))

  return (
    <CheatcodesTemplateScreen
      title="Tuiles séances cinéma"
      flexDirection="column"
      onGoBack={goBack}>
      <Button wording={`Jour ${day} → passer au jour ${day === 1 ? 2 : 1}`} onPress={toggleDay} />

      <Section>
        <Typo.Title4>Playlist avec des contenus de hauteurs différentes</Typo.Title4>
        <Typo.BodyAccentXs>
          Changer de jour doit conserver l’alignement sur la plus grande tuile. La playlist doit
          également défiler horizontalement sur toutes les plateformes.
        </Typo.BodyAccentXs>
        <CinemaScreeningCardList screenings={screenings} />
      </Section>
    </CheatcodesTemplateScreen>
  )
}

const Section = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
  gap: theme.designSystem.size.spacing.s,
}))
