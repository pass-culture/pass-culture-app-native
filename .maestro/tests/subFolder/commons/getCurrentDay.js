const MINIMUM_CANCELLATION_DAYS = 3;

const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + MINIMUM_CANCELLATION_DAYS);

output.targetDateIso = targetDate.toISOString().slice(0, 10);

const dayName = days[targetDate.getDay()];
const day = targetDate.getDate();
const monthName = months[targetDate.getMonth()];
const formattedDate = `${dayName} ${day} ${monthName}`;
output.targetDateTest = `.*${formattedDate}.*`;