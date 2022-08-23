type ChoiceOptions = {
  one?: string
  other?: string
}

export const plural = (value: number | string, options: ChoiceOptions): string => {
  if (options.one && value === 1) return options.one.replace('#', '1')
  if (options.other && value > 1) return options.other.replace('#', value.toLocaleString('fr'))
  return ''
}
