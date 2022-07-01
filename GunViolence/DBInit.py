# Dependencies and Setup
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy import func
from sqlalchemy.orm import Session
import sqlalchemy as db

# Postgres Connection String
from config import User

# Set up Postgres DB Connections
cestring = f'{User}GunData'
engine = create_engine(cestring)
session = Session(engine)

# Create database if it does not exist.
if not database_exists(cestring):
    create_database(cestring)
else:
    # Connect the database if exists.
    connection = engine.connect()
    metadata = db.MetaData()

# GVA data from Gun Violence Archive Data
get_GVA = "../Data/GVA13_18.csv"
GVA_data = pd.read_csv(get_GVA)

# Regulation data from Firearm Provisions 
get_REG = "../Data/USREG.csv"
REG_data = pd.read_csv(get_REG)

# FBI NICS data from FBI 
get_FBI = "../Data/FBI_NICs_Data.csv"
FBI_data = pd.read_csv(get_FBI)


# Participant data from Pivot
get_PRT = "../Data/GVA_Participant.csv"
# Low memory setting allows nulls to be retained
PRT_data = pd.read_csv(get_PRT, low_memory=False)

# State GeoCenter Data
get_SGL = "../Data/StateGeoCenter.csv"
SGL_data = pd.read_csv(get_SGL)

# Mass Shooting Data
get_MSS = "../Data/MSS82_22.csv"
MSS_data = pd.read_csv(get_MSS)


# Working copy of GVA, FBI and REG data. 
GVA = pd.DataFrame(GVA_data)
FBI = pd.DataFrame(FBI_data)
REG = pd.DataFrame(REG_data)
PRT = pd.DataFrame(PRT_data)
SGL = pd.DataFrame(SGL_data)
MSS = pd.DataFrame(MSS_data)


# Definition of FBI table and write to DB
Columns = ['month',
           'state', 
           'permit', 
           'permit_recheck', 
           'handgun', 
           'long_gun',
           'other',
           'multiple',
           'admin', 
           'prepawn_handgun',
           'prepawn_long_gun',
           'prepawn_other', 
           'redemption_handgun',
           'redemption_long_gun',
           'redemption_other',
           'returned_handgun', 
           'returned_long_gun',
           'returned_other',
           'rentals_handgun',
           'rentals_long_gun',
           'private_sale_handgun',
           'private_sale_long_gun',
           'private_sale_other',
           'return_to_seller_handgun',
           'return_to_seller_long_gun',
           'return_to_seller_other',
           'totals'
          ]
NewNames = {'month' : 'Month',
           'state': 'State',
           'permit': 'Permit',
           'permit_recheck': 'Permit_Recheck',
           'handgun': 'Handgun',
           'long_gun': 'Long_Gun', 
           'other': 'Other', 
           'multiple': 'Multiple',
           'admin' : 'Admin', 
           'prepawn_handgun': 'PrePawn_Handgun',
           'prepawn_long_gun':  'Pre_Pawn_Long_Gun',
           'prepawn_other': 'Prepawn_Other',
           'redemption_handgun': 'Redemption_Handgun',
           'redemption_long_gun':'Redemption_Long_Gun',
           'redemption_other': 'Redemption_Other',
           'returned_handgun': 'Returned_Handgun',
           'returned_long_gun':'Returned_Long_Gun',
           'returned_other': 'Returned_Other',
           'rentals_handgun':'Rentals_Handgun',
           'rentals_long_gun':'Rentals_Long_Gun',
           'private_sale_handgun':'Private_Sale_Handgun',
           'private_sale_other':'Private_Sale_Other',
           'return_to_seller_handgun':'Return_To_Seller_Handgun',
           'return_to_seller_long_gun':'Return_To_Seller_Long_Gun',
           'return_to_seller_other': 'Return_To_Seller_Other',
           'totals': 'Totals'
        }

FBIIncidAll = FBI[Columns].rename(columns=NewNames)
FBIIncidAll.index.rename('NICsChecksID', inplace=True)
FBIIncidAll.to_sql('NICsChecks', engine, index=True, if_exists='replace')

# Definition of Regulations table and write to DB
Columns = ['state',
            'year',
            'lawtotal'
          ]
NewNames = {'state':'State',
            'year': 'Year',
            'lawtotal': 'Law_Total'
           }
REGAll = REG[Columns].rename(columns=NewNames)
REGAll.index.rename('RegulationID', inplace=True)
REGAll.to_sql('Regulations', engine, index=True, if_exists='replace')

# Definition of State Geolocation table and write to DB
Columns = ['state',
            'latitude',
            'longitude',
            'name'
          ]

NewNames = {'state':'state',
            'latitude':'latitude',
            'longitude': 'longitude'
           }
SGLAll = SGL[Columns].rename(columns=NewNames).set_index('state')
SGLAll.to_sql('StateGeoLoc', engine, index=True, if_exists='replace')

# Definition of Incident table and write to DB
Columns = ['incident_id',
            'date',
            'state',
            'city_or_county',
            'n_killed',
            'latitude',
            'longitude',
            'state_house_district',
            'state_senate_district'
          ]
NewNames = {'incident_id':'IncidentID',
            'date': 'Date',
            'state': 'State',
            'city_or_county': 'City',
            'n_killed': 'No_Killed',
            'latitude': 'Latitude',
            'longitude': 'longitude',
            'state_house_district': 'House_District',
            'state_senate_district': 'Senate_District'
           }
GVAIncidAll = GVA[Columns].rename(columns=NewNames).set_index('IncidentID')
GVAIncidAll.to_sql('Incident', engine, index=True, if_exists='replace')

# Definition of Participant Master table
Columns = ['incident_id',
            'participant_age_group',
            'participant_gender',
            'participant_name',
            'participant_relationship',
            'participant_status',
            'participant_type'
          ]
NewNames = {'incident_id':'IncidentID',
            'participant_age_group': 'Age',
            'participant_gender': 'Gender',
            'participant_name': 'Name',
            'participant_relationship': 'Relationship',
            'participant_status': 'Status',
            'participant_type': 'Type'
           }
GVAPartAll = GVA[Columns].rename(columns=NewNames)
GVAPartAll.index.rename('ParticipantID', inplace=True)
GVAPartAll.to_sql('Participants', engine, if_exists='replace')

# Definition of Participant Pivot table
Columns = ['incident_id',
            'participant_id',
            'Age',
            'AgeGroup',
            'Gender',
            'Name',
            'Relationship',
            'Status',
            'Type',
            'GunStolen',
            'GunType'
          ]
NewNames = {'incident_id':'IncidentID',
            'participant_id': 'ParticipantID',
            'Age':'Age',
            'AgeGroup':'AgeGroup',
            'Gender': 'Gender',
            'Name': 'Name',
            'Relationship': 'Relationship',
            'Status': 'Status',
            'Type': 'Type',
            'GunStolen': 'Gun_stolen',
            'GunType': 'Gun_type'
           }
PRTAll = PRT[Columns].rename(columns=NewNames).set_index('IncidentID')
PRTAll.to_sql('ParticipantDetail', engine, if_exists='replace')

# Definition of Incident_urls table
Columns = ['incident_id',
            'source_url',
            'incident_url',
            'sources',
          ]
NewNames = {'incident_id':'IncidentID',
            'source_url': 'SourceUrl',
            'incident_url': 'IncidentUrl',
            'sources': 'SourcesUrl',
           }
GVAUrlAll = GVA[Columns].rename(columns=NewNames).set_index('IncidentID')
GVAUrlAll.to_sql('IncidentUrl', engine, index=True, if_exists='replace')

# Definition of Mass Shootings table and write to DB
Columns = ['case',
            'location',
            'location_type',
            'date',
            'age_of_shooter',
            'summary',
            'fatalities',
            'weapon_type',
            'weapon_details',
            'injured',
            'latitude',
            'longitude',
            'type',
            'gender'
          ]
NewNames = {'case':'case',
            'location': 'location',
            'location_type': 'location_type',
            'date': 'date',
            'age_of_shooter': 'age_of_shooter',
            'summary': 'summary',
            'fatalities': 'fatalities',
            'weapon_type': 'weapon_type',
            'weapon_details': 'weapon_details',
            'injured': 'injured',
            'latitude': 'Latitude',
            'longitude': 'longitude',
            'type': 'type',
            'gender': 'gender'
           }
MSSAll = MSS[Columns].rename(columns=NewNames)
MSSAll.index.rename('MassShootingID', inplace=True)
MSSAll.to_sql('MassShootings', engine, index=True, if_exists='replace')

# Addition to project to have python do the work and write the result to postgres
# Compares count of Incidents .vs sum of Applications over available time periods

# Reformat dates across input datasets
GVA['comp_date'] = pd.to_datetime(GVA['date'], format= '%Y-%m-%d')
FBI['comp_date'] = pd.to_datetime(FBI['month'], format= '%Y-%m')
GVA['YM'] = GVA['comp_date'].apply(lambda x: x.strftime('%Y%m'))
FBI['YM'] = FBI['comp_date'].apply(lambda x: x.strftime('%Y%m')) 

# Summarize Datasets to share a level of graularity
GVAByYear = pd.DataFrame(GVA.groupby('YM')['incident_id'].count())
FBIByYear = pd.DataFrame(FBI.groupby('YM')['permit'].sum())

# Merge Datasets and replace null values
GVAFBI = GVAByYear.merge(FBIByYear, on='YM', how='outer').reset_index()
GVAFBI = GVAFBI.fillna(0)

# Definition of Applications vs Incidents table
Columns = ['YM',
            'incident_id',
            'permit'
          ]
NewNames = {'YM':'Period',
            'incident_id':'IncidentCount',
            'permit': 'PermitCount',
           }
GVAVsAPP = GVAFBI[Columns].rename(columns=NewNames).set_index('Period')
GVAVsAPP.to_sql('IncVApp', engine, index=True, if_exists='replace')


# TODO
# Sql Function to break apart and pivot participant data
# At present this is being run outside of this script
# session.execute(func.public.vw_gva_ds())
# results = session.execute(func.public.select1())
# print(results)