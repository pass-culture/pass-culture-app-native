import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import { ConversationalSearchAnswer } from 'cheatcodes/pages/features/conversationalSearch/components/ConversationalSearchAnswer'
import { ConversationalSearchOfferCard } from 'cheatcodes/pages/features/conversationalSearch/components/ConversationalSearchOfferCard'
import { getDisplayedOffers } from 'cheatcodes/pages/features/conversationalSearch/helpers/parseAgentCompletion'
import { Exchange } from 'cheatcodes/pages/features/conversationalSearch/types'
import { Accordion } from 'ui/components/Accordion'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { Typo } from 'ui/theme'

const MAX_RAW_JSON_LENGTH = 3000

type Props = {
  exchange: Exchange
}

const formatDuration = (durationInMs: number): string =>
  `${(durationInMs / 1000).toFixed(1).replace('.', ',')}\u00a0s`

const getAnswerTitle = (durationInMs?: number): string =>
  durationInMs === undefined
    ? 'Réponse de l’agent'
    : `Réponse de l’agent · ${formatDuration(durationInMs)}`

const getOffersTitle = (count: number, areCited: boolean): string => {
  if (areCited)
    return count > 1 ? `${count} offres citées par l’agent` : '1 offre citée par l’agent'
  return count > 1 ? `${count} offres trouvées` : `${count} offre trouvée`
}

export const ConversationalSearchQuestion = ({ question }: { question: string }) => (
  <QuestionBubble>
    <Typo.BodyAccent>{question}</Typo.BodyAccent>
  </QuestionBubble>
)

export const ConversationalSearchExchange = ({ exchange }: Props) => {
  const { question, durationInMs, completion, raw, error } = exchange

  const rawJson = useMemo(
    () => (raw === undefined ? '' : JSON.stringify(raw, null, 2).slice(0, MAX_RAW_JSON_LENGTH)),
    [raw]
  )

  const displayedOffers = completion ? getDisplayedOffers(completion) : []

  return (
    <ViewGap gap={4}>
      <ConversationalSearchQuestion question={question} />

      {error ? <Banner type={BannerType.ERROR} label={error} /> : null}

      {completion ? (
        <React.Fragment>
          <ViewGap gap={2}>
            <Typo.BodyAccentXs>{getAnswerTitle(durationInMs)}</Typo.BodyAccentXs>
            <ConversationalSearchAnswer text={completion.text} />
          </ViewGap>

          {displayedOffers.length ? (
            <ViewGap gap={3}>
              <Typo.BodyAccentXs>
                {getOffersTitle(displayedOffers.length, !!completion.citedOffers.length)}
              </Typo.BodyAccentXs>
              <VerticalUl gap={4}>
                {displayedOffers.map((offer) => (
                  <Li key={offer.objectID}>
                    <ConversationalSearchOfferCard offer={offer} />
                  </Li>
                ))}
              </VerticalUl>
            </ViewGap>
          ) : null}

          <Accordion title="Détails techniques">
            <ViewGap gap={2}>
              {completion.searches.map((search, index) => (
                <Typo.BodyXs key={`${index}-${search.queries.join('|')}`}>
                  {`Recherche ${index + 1}\u00a0: ${search.queries.join(' · ')} (${search.nbHits} résultats)`}
                </Typo.BodyXs>
              ))}
              <Typo.BodyXs>
                {`Offres remontées par les recherches\u00a0: ${completion.offers.length}`}
              </Typo.BodyXs>
              {completion.unknownCitedOfferIds.length ? (
                <Typo.BodyXs>
                  {`Offres citées absentes des résultats\u00a0: ${completion.unknownCitedOfferIds.join(', ')}`}
                </Typo.BodyXs>
              ) : null}
              <Typo.BodyXs>{rawJson}</Typo.BodyXs>
            </ViewGap>
          </Accordion>
        </React.Fragment>
      ) : null}
    </ViewGap>
  )
}

const QuestionBubble = styled.View(({ theme }) => ({
  alignSelf: 'flex-end',
  maxWidth: '85%',
  backgroundColor: theme.designSystem.color.background.subtle,
  borderRadius: theme.designSystem.size.borderRadius.m,
  paddingVertical: theme.designSystem.size.spacing.s,
  paddingHorizontal: theme.designSystem.size.spacing.m,
}))
