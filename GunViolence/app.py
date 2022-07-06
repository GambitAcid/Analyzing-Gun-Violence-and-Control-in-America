# Dependencies
## from ntpath import join
from flask import Flask 

# Import Flask
from flask import Flask, jsonify, request, render_template

# Dependencies and Setup
import pandas as pd
import sqlalchemy as db
import json
import geojson
from sqlalchemy import create_engine, func
from sqlalchemy import inspect
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
Regulations = db.Table('Regulations', metadata, autoload=True, autoload_with=engine)

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
@app.route("/api/v1.0/incidents")
def incidents():
    '''Incident API Gun Violence App'''
    print('entered incident route')
    query = db.select([Incident]) 
    ResultProxy = connection.execute(query)
    ResultSet = ResultProxy.fetchall()

    # move table to df
    df = pd.DataFrame(ResultSet)
    df.columns = ResultSet[0].keys()
    df.dropna(subset=['Latitude', 'longitude'], inplace=True)

    # Limit size for testing **
    df_top =  df.head(1000)

    # Generate return values geojson
    geojson = {"type": "FeatureCollection", "features": []}

    for _, row in df_top.iterrows():
        feature = {"type": "Feature", "geometry": {"type": "Point",
                "coordinates": [row['longitude'], row['Latitude']]},
                "properties": {"city": row['City'],"state": row['State'],
                                "incidentID": row['IncidentID'],"date": row['Date'],
                                "killed": row['No_Killed']}}
        geojson['features'].append(feature)
    
    return geojson

# Incidents by Date Route
@app.route("/api/v1.0/incidentsByDate",  methods=["POST"])
def incidentsByDate(date):
    '''Incident API Gun Violence App'''
    print('entered incident route')
    query = db.select([Incident]) 
    ResultProxy = connection.execute(query)
    ResultSet = ResultProxy.fetchall()

    # move table to df
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
                "properties": {"city": row['City'],"state": row['State'],
                                "incidentID": row['IncidentID'],"date": row['Date'],
                                "killed": row['No_Killed']}}
        geojson['features'].append(feature)
    
    return geojson

# Incidents by Year Route
@app.route("/api/v1.0/incidentsByYear",  methods=["POST"])
def incidentsByYear(year):
    '''Incident API Gun Violence App'''
    print('entered incident route')
    query = db.select([Incident]) 
    ResultProxy = connection.execute(query)
    ResultSet = ResultProxy.fetchall()

    # move table to df
    df = pd.DataFrame(ResultSet)
    df.columns = ResultSet[0].keys()
    df.dropna(subset=['Latitude', 'longitude'], inplace=True)

    # Select by year
    df['comp_date'] = pd.to_datetime(df['Date'], format= '%Y-%m-%d')
    df_year = df[df['comp_date'].dt.year == year]

    # Generate return values geojson
    geojson = {"type": "FeatureCollection", "features": []}

    for _, row in df_year.iterrows():
        feature = {"type": "Feature", "geometry": {"type": "Point",
                "coordinates": [row['longitude'], row['Latitude']]},
                "properties": {"city": row['City'],"state": row['State'],
                                "incidentID": row['IncidentID'],"date": row['Date'],
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
                            "permit": row['Permit'],"handgun": row['Handgun'],
                            "long_gun": row['Long_Gun']}}
        geojson['features'].append(feature)
    
    return geojson


# Define behavoir for main
if __name__ == '__main__':
    app.run(debug=True)

# # Regulations Route
# @app.route("/api/v1.0/regulations",  methods=["GET", "POST"])
# def regulations():
#         '''Do Soomething here'''
#         # Return JSON 



# # Another Route
# @app.route("/api/v1.0/another2")
# def another2():
#         '''Do Soomething here'''
#         # Return JSON 

# # Date Choice Route
# @app.route("/api/v1.0/choice", methods=["GET", "POST"])
# def choice():
#         '''Do Soomething here'''
#         # Return JSON 
