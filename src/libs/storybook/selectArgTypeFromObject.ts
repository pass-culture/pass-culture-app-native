export const selectArgTypeFromObject = (obj: Record<string, unknown>) => ({
  options: Object.keys(obj),
  mapping: obj,
  control: {
    type: 'select',
    labels: Array.from(Object.keys(obj)).reduce(
      (labels, key) => ({
        ...labels,
        [key]: key,
      }),
      {}
    ),
  },
})
