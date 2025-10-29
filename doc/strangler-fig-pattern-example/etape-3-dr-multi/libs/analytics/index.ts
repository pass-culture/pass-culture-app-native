
// doc/strangler-fig-pattern-example/libs/analytics/index.ts

// Fonction simplifiée pour l'exemple
export const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize, padding }) => {
  const paddingToBottom = padding || 20;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

// Mock pour analytics.logAllModulesSeen
export const analytics = {
  logAllModulesSeen: (length: number) => console.log(`Analytics: All ${length} modules seen.`), // eslint-disable-line no-console
};
