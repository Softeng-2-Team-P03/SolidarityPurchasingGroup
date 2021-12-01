SPRINT #2 RETROSPECTIVE (Team P03)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 9 committed vs 6 done
- Total points committed vs done: 52 vs 31
- Nr of hours planned vs spent (as a team): 
  - Hours planned: 113h 20m
  - Hours spent as a team: 112h 30m

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  | 15      | -      | 48h 50m    | 54h 20m      |
| _#2_  | 3       | 5      | 4h 30m     | 3h 10m       |
| _#4_  | 5       | 2      | 7h 30m     | 10h          |
| _#5_  | 3       | 3      | 5h         | 3h           |
| _#6_  | 1       | 5      | 1h         | 1h           |
| _#7_  | 5       | 8      | 6h 30m     | 4h 30m       |
| _#8_  | 6       | 3      | 9h 30m     | 8h 30m       |
| _#9_  | 12      | 13     | 19h        | 21h 30m      |
| _#10_ | 7       | 5      | 9h 30m     | 1h 30m       |
| _#11_ | 4       | 8      | 5h 30m     | 5h           |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation):
  - Average: 2.49, Standard Deviation: 6.21 (In this calculation is included the sprint planning which took 14h)
  - Average: 2.08, Standard Deviation: 3.32 (Sprint planning not included, we had a single big task for technical debt)
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 116h 50m / 112h 30m = 1.04

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 19h
  - Total hours spent: 12h
  - Nr of automated unit test cases: 114 (29 + 85)
  - Coverage (if available): 35.4%
- E2E testing:
  - Total hours estimated: 7h 30m
  - Total hours spent: 4h 30m
- Code review 
  - Total hours estimated: 8h
  - Total hours spent: 6h 30m
- Technical Debt management:
  - Total hours estimated: 10h
  - Total hours spent: 7h 30m
  - Hours estimated for remediation by SonarQube: 10h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 10h 
  - Hours spent on remediation: 7h 30m 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.3%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): A, A, A
  


## ASSESSMENT

- What caused your errors in estimation (if any)? 
  - underestimation of time needed to implement some feateures (coding).
  - underestimation of time needed to implement tests.
  - unexpected issues with setup of frameworks and tools.
  - misunderstanding the meaning of some tasks. 

- What lessons did you learn (both positive and negative) in this sprint?
  - we have overestimated our productivity level.
  - setup of new technologies and tools are very difficult to estimate since we do not know enough about them.

- Which improvement goals set in the previous retrospective were you able to achieve?
  - we increased our overall coverage from 4% to 35%, it's still not enough but we will improve it furthermore.
  
- Which ones you were not able to achieve? Why?
  - we were not able to meet our objective to have (at least) 4 scrum meetings for this sprint because we all started to work late.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - start to work sooner and have at least 4 scrum meetings, we intend to achieve this objective creating the scrum meeting tasks with their respective dates already during the sprint planning.
  - improve coverage level. We intend to do so by learning how to mock functions to provide more in-depth unit tests and by setting up the tool we are using for end to end tests in a way that its coverage reports are accounted by sonarcloud.
  - be more prepared for the demo by preparing a nicer and more complete presentation.

- One thing you are proud of as a Team!!
  - we are proud of our team cohesion during critical moments.
