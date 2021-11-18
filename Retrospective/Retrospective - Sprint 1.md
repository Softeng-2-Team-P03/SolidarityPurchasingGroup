SPRINT #1 RETROSPECTIVE (Team P03)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed = 6 vs done = 3
- Total points committed (31 points) vs done (21 points)
- Nr of hours planned = 112h 20m vs spent = 118h 25m (as a team)

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  | 13      | -      | 39h 50m    | 62h          |
| _#1_  | 14      | 8      | 23h        | 33h 15m      |
| _#2_  | 5       | 5      | 12h        | 9h           |
| _#3_  | 4       | 8      | 7h         | 25m          |
| _#4_  | 7       | 2      | 11h 30m    | 6h 15m       |
| _#5_  | 6       | 3      | 10h 30m    | 5h 30m       |
| _#6_  | 5       | 5      | 8h 30m     | 2h           |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average = 2.81 , standard deviation = 5.4833450196562
  
  (Please note that the Sprint Planning Task had 35 hours spent in total.
  Without this task: Hours per task average = 1.96, standard deviation = 1.4593251426523)
- Total task estimation error ratio: 112.333 / 118.417 = 0.949

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours 6h
  - Total hours 2h
  - Nr of automated unit test 13
  - Coverage (6%)
- E2E testing:
  - Total hours 3h 30m
  - Total hours 3h 30m
- Code review 
  - Total hours estimated 8h
  - Total hours spent 4h
- Technical Debt management:
  - Total hours estimated 0h
  - Total hours spent 0h
  - Hours estimated for remediation by SonarQube 10h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues 0
  - Hours spent on remediation 0
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") 1%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability = A, security = A, maintainability = A )
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  
  - Underevaluated the necessary time to assign points to all the stories and plan the first sprint, although for the next sprints we don't have to assign any points to stories anymore.
  - Underevaluated the time needed to set sonar.
  - Underevaluated time needed to learn to use the tools for testing (enzyme and React testing library).
  - Underevaluated bugfixing time.
  

- What lessons did you learn (both positive and negative) in this sprint?
  - We need to explicitly manage technical debt.
  - We need to account more time for learning to use new technologies in order to produce code with an higher quality ( more testing ).
  - Include at least 4 scrum meetings in the sprint planning (2 per week)


- Which improvement goals set in the previous retrospective were you able to achieve?
  - Created a more equal assignement of tasks in terms of effort/time
  
  
- Which ones you were not able to achieve? Why?
  - Keeping up with the general progress of the project, we got better but we definitely need to improve.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - More scrum meetings in order to not lose focus and keep everyone up to date.
  - Increasing the coverage we consider acceptable for our definition of DONE.

> Propose one or two

- One thing you are proud of as a Team!!
  - We've been complimented by Vetrò :sunglasses:
  - We're happy with the final result of this sprint.