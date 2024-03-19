export const getClusterImage = (points: number) => {
  if (points < 2) {
    return undefined
  }

  return points > 9 ? 'map_pin_cluster_9plus' : `map_pin_cluster_${points}`
}
