type ChoiceOptions = {
  singular?: string
  plural?: string
}

export const plural = (value: number, options: ChoiceOptions): string => {
  if (options.singular) {
    if (value === 0) return options.singular.replace('#', '0')
    if (value === 1) return options.singular.replace('#', '1')
  }
  if (options.plural && value > 1) return options.plural.replace('#', value.toLocaleString('fr'))
  return ''
}
