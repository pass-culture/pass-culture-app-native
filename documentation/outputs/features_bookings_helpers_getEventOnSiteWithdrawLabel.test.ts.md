getEventOnSiteWithdrawLabel
 without withdrawal delay informed
- should return "Billet à retirer sur place" if event in 3 days
- should return "Billet à retirer sur place" if event in 2 days
- should return "Billet à retirer sur place d’ici demain" if event is tomorrow


 with withdrawal delay less than 24 hours
- should return "Billet à retirer sur place dans 3 jours" if event in 3 days
- should return "Billet à retirer sur place dans 2 jours" if event in 2 days


 with 24 hours withdrawal delay
- should return "Billet à retirer sur place dans 2 jours" if event in 3 days
- should return "Billet à retirer sur place dès demain" if event in 2 days
- should return "Billet à retirer sur place dès aujourd'hui"if event is tomorrow


 with 48 hours withdrawal delay
- should return "Billet à retirer sur place dès demain" if event in 3 days
- should return "Billet à retirer sur place dès aujourd'hui"if event in 2 days
- should return "Billet à retirer sur place dès aujourd’hui" if event is tomorrow
- should return "Billet à retirer sur place aujourd’hui" if event is today


 getEventOnSiteWithdrawLabel
- should return an empty string if the event will start in more than 3 days
- should return an empty string if the event has started

