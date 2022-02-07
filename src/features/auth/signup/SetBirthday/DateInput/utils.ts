export interface DateValidation {
  isComplete: boolean
  isValid: boolean
  isDateAboveMin: boolean
  isDateBelowMax: boolean
}

export interface DateInputRef {
  clearFocuses: () => void
}
