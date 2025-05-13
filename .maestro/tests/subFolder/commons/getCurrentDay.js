const MINIMUM_CANCELLATION_DAYS = 3;

const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + MINIMUM_CANCELLATION_DAYS);

output.targetDateIso = targetDate.toISOString().slice(0, 10);

output.targetDateTest = targetDate
  .toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  .replace(/(^|\s)([a-zà-ÿ])/g, (m) => m.toUpperCase());