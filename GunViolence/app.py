# Dependencies
# Import Flask | Sqlalchemy | json | geojson
from flask import Flask
from flask import Flask, jsonify, request, render_template

import pandas as pd

import sqlalchemy as db
from sqlalchemy import create_engine, func
from sqlalchemy import inspect

import json
import geojson
from geojson import Point, Feature

# Postgres Connection String
from config import User

# Set up Postgres DB Connections
cestring = f'{User}GunData'
engine = create_engine(cestring)
connection = engine.connect()
metadata = db.MetaData()

# NICS data
nics_df = pd.read_csv("static/Data/NICsChecks_Geocoords.csv").dropna(how="any")

# Save table reference
Incident = db.Table('Incident', metadata, autoload=True, autoload_with=engine)
Regulations = db.Table('Regulations', metadata,
                       autoload=True, autoload_with=engine)
StateGeoLoc = db.Table('StateGeoLoc', metadata,
                       autoload=True, autoload_with=engine)
MassShootings = db.Table('MassShootings', metadata,
                         autoload=True, autoload_with=engine)

# Flask Setup
app = Flask(__name__)

# Flask Routes
# Home Route


@app.route("/")
def home():

    return render_template('index.html')

# # incident Home Route
# @app.route("/api/v1.0/incident")
# def homeincidente():

#     return render_template('incident.html')

# Incidents Route


@app.route("/api/v1.0/incidents",  methods=["GET", "POST"])
def incidents():
    '''Incident API Gun Violence App'''

    query = db.select([Incident])
    ResultProxy = connection.execute(query)
    ResultSet = ResultProxy.fetchall()
    df = pd.DataFrame(ResultSet)
    df.columns = ResultSet[0].keys()
    df.dropna(subset=['Latitude', 'longitude'], inplace=True)
    year = 2017  # **
    df['comp_date'] = pd.to_datetime(df['Date'], format='%Y-%m-%d')
    df_year = df[df['comp_date'].dt.year == year]

    # Generate return values geojson
    geojson = {"type": "FeatureCollection", "features": []}

    for _, row in df_year.iterrows():
        feature = {"type": "Feature", "geometry": {"type": "Point",
                                                   "coordinates": [row['longitude'], row['Latitude']]},
                   "properties": {"city": row['City'], "state": row['State'],
                                  "incidentID": row['IncidentID'], "date": row['Date'],
                                  "killed": row['No_Killed']}}
        geojson['features'].append(feature)

    return geojson

# Incidents by Date Route


@app.route("/api/v1.0/incidentsByDate",  methods=["GET", "POST"])
def incidentsByDate(date):
    '''Incident API Gun Violence App'''

    query = db.select([Incident])
    ResultProxy = connection.execute(query)
    ResultSet = ResultProxy.fetchall()
    df = pd.DataFrame(ResultSet)
    df.columns = ResultSet[0].keys()
    df.dropna(subset=['Latitude', 'longitude'], inplace=True)

    # Select by date
    df_date = df[df['Date'] == date]

    # Generate return values geojson
    geojson = {"type": "FeatureCollection", "features": []}

    for _, row in df_date.iterrows():
        feature = {"type": "Feature", "geometry": {"type": "Point",
                                                   "coordinates": [row['longitude'], row['Latitude']]},
                   "properties": {"city": row['City'], "state": row['State'],
                                  "incidentID": row['IncidentID'], "date": row['Date'],
                                  "killed": row['No_Killed']}}
        geojson['features'].append(feature)

    return geojson

# Incidents by Year Route


@app.route("/api/v1.0/incidentsByYear",  methods=["GET", "POST"])
def incidentsByYear(year):
    '''Incident API Gun Violence App'''

    query = db.select([Incident])
    ResultProxy = connection.execute(query)
    ResultSet = ResultProxy.fetchall()
    df = pd.DataFrame(ResultSet)
    df.columns = ResultSet[0].keys()
    df.dropna(subset=['Latitude', 'longitude'], inplace=True)  # **

    # Select by year
    df['comp_date'] = pd.to_datetime(df['Date'], format='%Y-%m-%d')
    df_year = df[df['comp_date'].dt.year == year]

    # Generate return values geojson
    geojson = {"type": "FeatureCollection", "features": []}

    for _, row in df_year.iterrows():
        feature = {"type": "Feature", "geometry": {"type": "Point",
                                                   "coordinates": [row['longitude'], row['Latitude']]},
                   "properties": {"city": row['City'], "state": row['State'],
                                  "incidentID": row['IncidentID'], "date": row['Date'],
                                  "killed": row['No_Killed']}}
        geojson['features'].append(feature)

    return geojson
    ### NICs Route By State ###


@app.route("/api/v1.0/NICsStates")
def nics_states():
    geojson = {"type": "FeatureCollection", "features": []}

    for _, row in nics_df.iterrows():
        feature = {"type": "Feature", "geometry": {"type": "Point",
                                                "coordinates": [row['longitude'], row['Latitude']]},
                "properties": {"state": row['State'],
                                "permit": row['Permit'], "handgun": row['Handgun'],
                                "long_gun": row['Long_Gun']}}
        geojson['features'].append(feature)

    return geojson

# Regulations Route
@app.route("/api/v1.0/regulations",  methods=["GET", "POST"])
def regulations():
    '''Regulations by State'''

    # Get Regulation data
    query = db.select([Regulations])
    ResultProxy = connection.execute(query)
    ResultSet = ResultProxy.fetchall()
    df = pd.DataFrame(ResultSet)
    df.columns = ResultSet[0].keys()
    dfSum = pd.DataFrame(df.groupby('State')['Law_Total'].sum())

    # Get State Geo Location data
    query = db.select([StateGeoLoc])
    ResultProxy = connection.execute(query)
    ResultSet = ResultProxy.fetchall()

    # move table to df
    st = pd.DataFrame(ResultSet)
    st.columns = ResultSet[0].keys()

    # Join Regulations and State Geo Location
    stgl = pd.merge(dfSum, st,  how='inner', left_on=[
                    'State'], right_on=['name'])

    # Generate return values geojson
    geojson = {"type": "FeatureCollection", "features": []}
    for _, row in stgl.iterrows():
        feature = {"type": "Feature", "geometry": {"type": "Point",
                   "coordinates": [row['longitude'], row['latitude']]},
                   "properties": {"lawTotal": row['Law_Total'], "stateAbbr": row['state'],
                                  "stateName": row['name']
                                  }}
        geojson['features'].append(feature)

    # Return JSON
    return geojson

# MassShootings Route


@app.route("/api/v1.0/massShootings",  methods=["GET", "POST"])
def massShootings():
    '''Mass Shootings'''

    # Get Mass Shooting data
    query = db.select([MassShootings])
    ResultProxy = connection.execute(query)
    ResultSet = ResultProxy.fetchall()
    ms = pd.DataFrame(ResultSet)
    ms.columns = ResultSet[0].keys()

    # Generate return values geojson
    geojson = {"type": "FeatureCollection", "features": []}

    for _, row in ms.iterrows():
        feature = {"type": "Feature", "geometry": {"type": "Point",
                                                   "coordinates": [row['longitude'], row['Latitude']]},
                   "properties": {"case": row['case'],
                                  "location": row['location'],
                                  "location_type": row['location_type'],
                                  "age_of_shooter": row['age_of_shooter'],
                                  "fatalities": row['fatalities'],
                                  "weapon_type": row['weapon_type'],
                                  "injured": row['injured'],
                                  "type": row['type'],
                                  "date": row['date']
                                  }}
        geojson['features'].append(feature)

    # Return JSON
    return geojson


# Define behavoir for main
if __name__ == '__main__':
    app.run(debug=True)
