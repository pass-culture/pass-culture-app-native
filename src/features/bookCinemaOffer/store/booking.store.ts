import { createStore } from 'libs/store/createStore'

export type BookingStep = 'date' | 'hour' | 'price' | 'duo' | 'confirmation'

export type BookingState = {
  offerId: number | undefined
  stockId: number | undefined
  date: string | undefined
  hour: string | undefined
  quantity: 1 | 2 | undefined
  steps: BookingStep[]
  currentStep: BookingStep | undefined
}

export const defaultBookingState: BookingState = {
  offerId: undefined,
  stockId: undefined,
  date: undefined,
  hour: undefined,
  quantity: undefined,
  steps: [],
  currentStep: undefined,
}

type StartBookingParams = {
  offerId: number
  stockId?: number
  date?: string
  hour?: string
  steps: BookingStep[]
}

const getInitialQuantity = (steps: BookingStep[]): 1 | undefined =>
  steps.length > 0 && !steps.includes('duo') ? 1 : undefined

export const bookingStore = createStore({
  name: 'booking',
  defaultState: defaultBookingState,
  actions: (set) => ({
    startBooking: ({ offerId, stockId, date, hour, steps }: StartBookingParams) =>
      set({
        ...defaultBookingState,
        offerId,
        stockId,
        date,
        hour,
        steps,
        currentStep: steps[0],
        quantity: getInitialQuantity(steps),
      }),
    goToNextStep: () =>
      set((state) => {
        const currentIndex = state.currentStep ? state.steps.indexOf(state.currentStep) : -1
        const nextStep = state.steps[currentIndex + 1]
        return nextStep ? { currentStep: nextStep } : state
      }),
    goToPreviousStep: () =>
      set((state) => {
        const currentIndex = state.currentStep ? state.steps.indexOf(state.currentStep) : -1
        const previousStep = state.steps[currentIndex - 1]
        return previousStep ? { currentStep: previousStep } : state
      }),
    selectDate: (date: string) =>
      set((state) => ({
        date,
        hour: undefined,
        stockId: undefined,
        quantity: getInitialQuantity(state.steps),
      })),
    selectHour: (hour: string) =>
      set({
        hour,
        stockId: undefined,
      }),
    selectStock: ({ stockId, hour }: { stockId: number; hour?: string }) =>
      set((state) => ({
        stockId,
        hour: hour ?? state.hour,
      })),
    selectQuantity: (quantity: 1 | 2) => set({ quantity }),
    reset: () => set(defaultBookingState),
  }),
  selectors: {
    selectOfferId: () => (state) => state.offerId,
    selectStockId: () => (state) => state.stockId,
    selectDate: () => (state) => state.date,
    selectHour: () => (state) => state.hour,
    selectQuantity: () => (state) => state.quantity,
    selectSteps: () => (state) => state.steps,
    selectCurrentStep: () => (state) => state.currentStep,
    selectCanGoBack: () => (state) =>
      !!state.currentStep && state.steps.slice(1).includes(state.currentStep),
  },
})

export const bookingActions = bookingStore.actions
export const bookingSelectors = bookingStore.selectors
export const {
  useStore: useBooking,
  useOfferId: useBookingOfferId,
  useStockId: useBookingStockId,
  useDate: useBookingDate,
  useHour: useBookingHour,
  useQuantity: useBookingQuantity,
  useSteps: useBookingSteps,
  useCurrentStep: useBookingCurrentStep,
  useCanGoBack: useBookingCanGoBack,
} = bookingStore.hooks
