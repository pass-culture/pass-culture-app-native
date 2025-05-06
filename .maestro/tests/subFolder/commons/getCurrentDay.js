const targetDate = new Date();

targetDate.setDate(targetDate.getDate() + 3);

const year = targetDate.getFullYear();
const month = ('0' + (targetDate.getMonth() + 1)).slice(-2);
const day = ('0' + targetDate.getDate()).slice(-2);
const formattedTargetDate = year + '-' + month + '-' + day;

output.put('targetDateTest', formattedTargetDate);
