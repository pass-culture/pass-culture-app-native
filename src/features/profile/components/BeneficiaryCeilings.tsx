import { t } from '@lingui/macro'
import React from 'react'
import { StyleSheet } from 'react-native'
import Dash from 'react-native-dash'
import styled from 'styled-components/native'

import { Expense } from 'api/gen'
import { AccordionItem } from 'features/offer/components'
import { CreditCeiling, getCreditCeilingProps } from 'features/profile/components/CreditCeiling'
import { ExpenseV2 } from 'features/profile/components/types'
import { _ } from 'libs/i18n'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

type BeneficiaryCeilingsProps =
  | {
      depositVersion: 1
      expenses: Array<Expense>
    }
  | {
      depositVersion: 2
      expenses: Array<ExpenseV2>
    }

const ceilingsQuestions = {
  v1: _(t`Pourquoi les biens physiques et numériques sont-ils limités ?`),
  v2: _(t`Pourquoi les biens numériques sont-ils limités ?`),
}

export function BeneficiaryCeilings(props: BeneficiaryCeilingsProps) {
  const question = props.depositVersion === 1 ? ceilingsQuestions.v1 : ceilingsQuestions.v2

  const expenses =
    props.depositVersion === 1
      ? (props.expenses as Array<Expense>)
      : (props.expenses as Array<ExpenseV2>)

  return (
    <Container>
      <Spacer.Column numberOfSpaces={6} />
      <Title>{_(t`Tu peux encore dépenser :`)}</Title>
      <Spacer.Column numberOfSpaces={5} />
      <CeilingsRow>
        {expenses.map((expense, index: number) => {
          return (
            <CreditCeiling
              key={index}
              amount={expense.current}
              max={expense.limit}
              {...getCreditCeilingProps(props.depositVersion, expense)}
            />
          )
        })}
      </CeilingsRow>
      <Spacer.Column numberOfSpaces={6} />
      <Separator dashGap={4} dashLength={1} dashThickness={1} />
      <AccordionItem
        title={<Typo.ButtonText>{question}</Typo.ButtonText>}
        titleStyle={accordionStyle.title}
        bodyStyle={accordionStyle.body}>
        <Description>
          {_(
            t`Le but du pass Culture est de renforcer vos pratiques culturelles,
            mais aussi d'en créer  de nouvelles. Ces plafonds ont été mis en place
            pour favoriser la diversification des pratiques culturelles.`
          )}
        </Description>
      </AccordionItem>
      <Spacer.Column numberOfSpaces={2} />
    </Container>
  )
}

const Container = styled.View({
  backgroundColor: ColorsEnum.GREY_LIGHT,
  borderRadius: 6,
})

const Title = styled(Typo.Title4)({
  paddingHorizontal: getSpacing(4),
})

const CeilingsRow = styled.View({
  paddingHorizontal: getSpacing(2),
  flexDirection: 'row',
  alignItems: 'flex-start',
})

const Separator = styled(Dash)({
  borderRadius: 100,
  overflow: 'hidden',
  width: '99%', // a 100% width put the first dot on the border of the view and a space at the end
  alignSelf: 'center',
})

const accordionStyle = StyleSheet.create({
  title: {
    paddingHorizontal: getSpacing(4),
    paddingBottom: getSpacing(4),
  },
  body: {
    paddingHorizontal: getSpacing(4),
    paddingBottom: getSpacing(4),
  },
})

const Description = styled(Typo.Body)({
  textAlign: 'justify',
})
