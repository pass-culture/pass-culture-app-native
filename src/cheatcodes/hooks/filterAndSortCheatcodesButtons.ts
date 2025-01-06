import { ButtonsWithSubscreensProps } from 'cheatcodes/types'

const isMatching = (filter: string, str?: string): boolean =>
  (str ?? '').toLowerCase().includes(filter.toLowerCase())

export const filterAndSortCheatcodesButtons = (
  filter: string,
  buttons: ButtonsWithSubscreensProps[]
): ButtonsWithSubscreensProps[] =>
  buttons
    .filter((button) => button.title || button.screen)
    .map((button): ButtonsWithSubscreensProps | null => {
      const filteredSubscreens = button.subscreens?.filter(
        (subscreen) => isMatching(filter, subscreen.title) || isMatching(filter, subscreen.screen)
      )
      const isButtonMatching =
        isMatching(filter, button.title) ||
        isMatching(filter, button.screen) ||
        (filteredSubscreens && filteredSubscreens.length > 0)
      return isButtonMatching ? { ...button, subscreens: filter ? filteredSubscreens : [] } : null
    })
    .filter((button): button is ButtonsWithSubscreensProps => button !== null)
    .sort((a, b) =>
      (a.title || a.screen || 'sans titre').localeCompare(b.title || b.screen || 'sans titre')
    )
