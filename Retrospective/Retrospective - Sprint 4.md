SPRINT #4 RETROSPECTIVE (Team P03)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 3 committed vs 3 done
- Total points committed vs done: 42 vs 42
- Nr of hours planned vs spent (as a team): 
  - Hours planned: 112h 30m
  - Hours spent as a team: 112h 20m

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  | 21      | -      | 8d 1h 10m    | 8d 3h 40m       |
| _#40_ | 8       | 21     | 1d 5h      | 1hd 4h 30m   |
| _#41_ | 15      | 13     | 3d         | 2d 7h 30m    |
| _#42_ | 6       | 8      | 1d 2h 20m  | 1d 40m       |


> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation):
  - Average: 1.9, Standard Deviation: 1.89 (In this calculation is included the sprint planning which took 14h)
  - Average: 1.70, Standard Deviation: 1.07 (Sprint planning not included, we had a single big task for technical debt)
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 97h 30m / 93h 40m = 1.04

Please, notice that the total sum of the hours estimated and spent are different than those declared in the macro statistics because here i amconsidering only the measures relative to the table, leaving out non-technical tasks of story 0 such as scrum meetings, sprint planning and the task allocated to prepare the presentation for the demo.

  
## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 6h
  - Total hours spent: 6h
  - Nr of automated unit test cases: 
  - Coverage (if available): 51.6% ( not complete because of a problem with coverage computation from part of our e2e tests, we're planning to fix it in the next sprint )
- E2E testing:
  - Total hours estimated: 5h
  - Total hours spent: 3h 30m
- Code review 
  - Total hours estimated: 3h 30m
  - Total hours spent: 3h
- Technical Debt management:
  - Total hours estimated: 7h
  - Total hours spent: 6h 30m
  - Hours estimated for remediation by SonarQube: 8h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 8h 
  - Hours spent on remediation: 6h 30m 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.5%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): A, A, A
  


## ASSESSMENT

- What caused your errors in estimation (if any)? 
  - Error in total estimation that have caused a total of 114h 20m of spent time are for the most part linked to the tasks regarding the use of nodemailer package (that was a new thing for all of us, so we were not able to estimate it properly in advance)
  - underestimation of time needed to implement some feateures.

- What lessons did you learn (both positive and negative) in this sprint?
  - it is very useful to go through the implemented functionalities all together with a dedicated meeting to simulate the stories.

- Which improvement goals set in the previous retrospective were you able to achieve?
  - we increased our overall coverage from 35% to 51.6%, it's still not enough but we will improve it furthermore.
  - we were able to have 4 scrum meetings in order to have a better team coordination.
  - we prepared a nicer presentation.
  
- Which ones you were not able to achieve? Why?
  - we haven't learnt how to mock functions with jest, still.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - organize technical meetingss at sprint planning time as tasks with a defined date in order to be able to go through any problem or redesign need asap.
  - fix problems with e2e tests and improve furthermore the overall coverage.

- One thing you are proud of as a Team!!
  - we're proud of the fact that we managed to send mails automatically through nodemailers even though none of us ever did something related to it.
