import { proAdvicesToAdviceCardData } from 'features/proAdvices/adapters/proAdvicesToAdviceCardData/proAdvicesToAdviceCardData'
import { proAdvicesFixture } from 'features/venue/fixtures/venueProAdvices.fixture'
import { TagVariant } from 'ui/designSystem/Tag/types'

describe('proAdvicesToAdviceCardData', () => {
  it('should transform pro advices to advice card data', () => {
    const proAdvices = [...proAdvicesFixture]
    const result = proAdvicesToAdviceCardData(proAdvices)

    expect(result).toEqual([
      {
        date: 'Septembre 2026',
        description:
          'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
        id: 1,
        subtitle: 'Livre',
        title: 'American dream',
        image: 'url',
        tagProps: { label: 'par Arthur', variant: TagVariant.PROEDITO },
        headerAccessibilityLabel: 'Voir l‘offre American dream',
        headerNavigateTo: { screen: 'Offer', params: { id: 1 } },
      },
      {
        date: 'Septembre 2026',
        description:
          'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
        id: 1,
        subtitle: 'Livre',
        title: 'American dream',
        tagProps: { label: 'par Bérangère', variant: TagVariant.PROEDITO },
        headerAccessibilityLabel: 'Voir l‘offre American dream',
        headerNavigateTo: { screen: 'Offer', params: { id: 1 } },
      },
    ])
  })

  it('should return "avis du pro" as tag label when author undefined', () => {
    const proAdvices = [{ ...proAdvicesFixture[0], author: undefined }]
    const result = proAdvicesToAdviceCardData(proAdvices)

    expect(result).toEqual([
      {
        date: 'Septembre 2026',
        description:
          'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
        id: 1,
        subtitle: 'Livre',
        title: 'American dream',
        image: 'url',
        tagProps: { label: 'avis du pro', variant: TagVariant.PROEDITO },
        headerAccessibilityLabel: 'Voir l‘offre American dream',
        headerNavigateTo: { screen: 'Offer', params: { id: 1 } },
      },
    ])
  })
})
