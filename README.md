# Gun-Violence-and-Control-in-America


## Begin edit LAF 06.26.2022 10:45a
# Database Creation Instructions 

* Clone or fetch respository
* In the data folder unzip GVA13_18.csv (inplace) see important note below
* Update config.py with your local Postgres connection string
* From terminal (or BASH) enter: python main.py

### When it finishes you should have: 

* A new db named GunData
*   In the public schema you should find the following tables: 
    * IncVapp (summary by period of Incidents .vs Applications)
    * Incident (complete incident information with a one to one relationship)
    * IncidentUrl (Urls relied on to create original dataset)
    * NICsChecks (FBI background check data)
    * Particiants (|| delimited participants dataset) see notes below
    * ParticipantsPivot (Compound Key tables with partcipant data)
    * Regulations (Contains limited set of Regulatory info used in 2nd prior project)


## Important notes

GVA13_18.csv this file should be in your gitignore that came down with your clone or fetch in which case you need to do nothing. But, if it is copied renamed or moved and gets pushed to the repository it will prevent future pulls because of its size. 

Participants Table - it is still here because it does contain information dropped from the pivot table. There are some incidents that involve many guns (as many as 399). In the pivot these multi-gun incidents created an additional 66,000+ rows that contain only gun type data. The vast majority of those **unknown**. If you would like to retrieve this additional gun information you will need to go back the participant table to retrieve it. If we determine that info is not required, we may drop that table from the final project.

Regulations Table - I only brought over data that had been used in the "other" project, however there is additional information in the codebook and the csv file. If any is useful, just say the word and it can be migrated to the db. 

Incident Table - Updated to include Latitude and Longitude (I will begin working on a heatmap) I will also work on other datasource(s) for more complete incident data. I will look at datasets that were dismissed for the initial project because they did not contain participant data, they may however contain enough data to determine geo location information that may be useful for this project. 

GVA_Initial_Eval.ipynb - This notebook is not active in anyway, it is the sandbox from the original project. It will be removed in future updates. 

## End edit LAF 06.26.2022 10:45a
