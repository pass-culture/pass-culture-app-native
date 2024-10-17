export const DEFAULT_EURO_TO_XPF_RATE = 119.48

// Remplacer ce hook par la récupération du taux de conversion depuis Firestore
export const useGetEuroToXPFRate = (): number => {
  return 119.48 ?? DEFAULT_EURO_TO_XPF_RATE
}
