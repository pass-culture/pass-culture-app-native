getAchievements
 Remaining achievements to complete
- should return "0 succès restant" when all achievements of category are completed
- should return "1 succès restants" when 1 achievement are not completed
- should return "2 succès restants" when 2 achievement are not completed


 text
- should return 0/2 when no achievements are completed
- should return 2/2 when all achievements are completed
- should return 1/2 when 1 achievement of 2 are completed


 Achievements progression
- should be 1 when all achievements are completed
- should be 0 when no achievements are completed
- should be 0.5 when 1 achievement of 2 are completed
- should be 0.75 when 3 achievement of 4 are completed


 Category Achievements completion


 From


 Tracking


 Number unlocked
- send 0 when no achievements are completed
- send 2 when 2 achievement are completed


 getAchievements
- should return empty array when there are no achievements
- should return achievements grouped by category
- achievement is NOT completed when user has not already completed it
- achievement is completed when user has already completed it
- achievement name is "Succès non débloqué" when achievement is not completed
- achievement completed name is the achievement name
- achivements are sorted by name
- achievement completed is sorted before achievement not completed

