import { getSpacing } from 'ui/theme/spacing'

export const buttonWidthStyle = ({ fitContentWidth }: { fitContentWidth: boolean }) => {
  const paddingHorizontal = fitContentWidth ? getSpacing(18) : 0
  const maxWidth = fitContentWidth ? 'fit-content' : undefined

  return {
    maxWidth,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: paddingHorizontal,
    paddingRight: paddingHorizontal,
  }
}
