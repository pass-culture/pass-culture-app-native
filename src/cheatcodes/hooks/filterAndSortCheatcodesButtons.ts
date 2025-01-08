import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'

const isMatching = (searchValue: string, str?: string): boolean =>
  (str ?? '').toLowerCase().includes(searchValue.toLowerCase())

export const filterAndSortCheatcodesButtons = (
  searchValue: string,
  buttons: CheatcodesButtonsWithSubscreensProps[]
): CheatcodesButtonsWithSubscreensProps[] =>
  buttons
    .filter((button) => button.title || button.screen)
    .map((button): CheatcodesButtonsWithSubscreensProps | null => {
      const filteredSubscreens = button.subscreens?.filter(
        (subscreen) =>
          isMatching(searchValue, subscreen.title) || isMatching(searchValue, subscreen.screen)
      )
      const isButtonMatching =
        isMatching(searchValue, button.title) ||
        isMatching(searchValue, button.screen) ||
        (filteredSubscreens && filteredSubscreens.length > 0)
      return isButtonMatching
        ? { ...button, subscreens: searchValue ? filteredSubscreens : [] }
        : null
    })
    .filter((button): button is CheatcodesButtonsWithSubscreensProps => button !== null)
    .sort((a, b) =>
      (a.title || a.screen || 'sans titre').localeCompare(b.title || b.screen || 'sans titre')
    )
