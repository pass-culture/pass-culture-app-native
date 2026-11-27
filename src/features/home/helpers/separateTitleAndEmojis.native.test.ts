import { separateTitleAndEmojis } from './separateTitleAndEmojis'

describe('separateTitleAndEmojis', () => {
  it.each`
    title                                             | expected
    ${'Cas classique 💥'}                             | ${{ titleEmoji: '💥', titleText: 'Cas classique' }}
    ${'Cas sans emojis'}                              | ${{ titleEmoji: '', titleText: 'Cas sans emojis' }}
    ${'Cas avec un espace à la fin 🚀 '}              | ${{ titleEmoji: '🚀', titleText: 'Cas avec un espace à la fin' }}
    ${'Cas avec deux emojis à la fin 🚀⭐'}           | ${{ titleEmoji: '🚀⭐', titleText: 'Cas avec deux emojis à la fin' }}
    ${'Cas avec des accents œŒéàèêËëù ⭐'}            | ${{ titleEmoji: '⭐', titleText: 'Cas avec des accents œŒéàèêËëù' }}
    ${'Cas avec un chiffre 3 🎸'}                     | ${{ titleEmoji: '🎸', titleText: 'Cas avec un chiffre 3' }}
    ${`Cas avec de la ponctuation ?,;.:!" 😀`}        | ${{ titleEmoji: '😀', titleText: 'Cas avec de la ponctuation ?,;.:!"' }}
    ${`Cas avec des caractères spéciaux €@#‰()[] 💾`} | ${{ titleEmoji: '💾', titleText: 'Cas avec des caractères spéciaux €@#‰()[]' }}
    ${'Cas avec plusieurs espaces   🎉'}              | ${{ titleEmoji: '🎉', titleText: 'Cas avec plusieurs espaces' }}
    ${'Cas avec 🎉 au milieu'}                        | ${{ titleEmoji: '', titleText: 'Cas avec 🎉 au milieu' }}
    ${'Cas avec 🎉 au milieu et à la fin 🎈'}         | ${{ titleEmoji: '🎈', titleText: 'Cas avec 🎉 au milieu et à la fin' }}
    ${'🎉'}                                           | ${{ titleEmoji: '🎉', titleText: '' }}
  `('should return $expected when title is $title', ({ title, expected }) => {
    expect(separateTitleAndEmojis(title)).toStrictEqual(expected)
  })

  it('should handle long titles with many spaces', () => {
    const title = `a${' '.repeat(100_000)}b`

    expect(separateTitleAndEmojis(title)).toStrictEqual({ titleEmoji: '', titleText: title })
  })
})
