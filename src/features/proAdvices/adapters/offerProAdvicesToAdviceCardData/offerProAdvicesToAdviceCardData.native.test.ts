import { proAdvicesFixture } from 'features/advices/fixtures/offerProAdvices.fixture'
import { offerProAdvicesToAdviceCardData } from 'features/proAdvices/adapters/offerProAdvicesToAdviceCardData/offerProAdvicesToAdviceCardData'
import { TagVariant } from 'ui/designSystem/Tag/types'

describe('offerProAdvicesToAdviceCardData', () => {
  it('should transform pro advices to advice card data', () => {
    const proAdvices = [...proAdvicesFixture]
    const result = offerProAdvicesToAdviceCardData(proAdvices, 1)

    expect(result).toEqual([
      {
        date: 'Septembre 2026',
        description:
          'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
        id: 1,
        subtitle: 'à 500 m',
        title: 'The Best Place',
        image: 'url',
        tagProps: { label: 'par Arthur', variant: TagVariant.PROEDITO },
        headerAccessibilityLabel: 'Voir le lieu The Best Place',
        headerNavigateTo: { screen: 'Venue', params: { id: 1 } },
        onCardHeaderPress: expect.any(Function),
      },
      {
        date: 'Septembre 2026',
        description:
          'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
        id: 2,
        subtitle: '',
        title: 'The Amazing Place',
        tagProps: { label: 'par Bérangère', variant: TagVariant.PROEDITO },
        headerAccessibilityLabel: 'Voir le lieu The Amazing Place',
        headerNavigateTo: { screen: 'Venue', params: { id: 2 } },
        onCardHeaderPress: expect.any(Function),
      },
    ])
  })

  it('should return "avis du pro" as tag label when author undefined', () => {
    const proAdvices = [{ ...proAdvicesFixture[0], author: undefined }]
    const result = offerProAdvicesToAdviceCardData(proAdvices, 1)

    expect(result).toEqual([
      {
        date: 'Septembre 2026',
        description:
          'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
        id: 1,
        subtitle: 'à 500 m',
        title: 'The Best Place',
        image: 'url',
        tagProps: { label: 'avis du pro', variant: TagVariant.PROEDITO },
        headerAccessibilityLabel: 'Voir le lieu The Best Place',
        headerNavigateTo: { screen: 'Venue', params: { id: 1 } },
        onCardHeaderPress: expect.any(Function),
      },
    ])
  })
})
