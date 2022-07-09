from sre_parse import State
from flask import Flask, request, jsonify, render_template 
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy import func
from sqlalchemy.orm import Session
import sqlalchemy as db
import pandas as pd
import psycopg2

from config import User

HOST = 'localhost'
USERNAME = 'postgres'
PASSWORD = 'admin'
DATABASE = 'GunData'
BACKGROUND_TABLE = 'NICsChecks'

# Set up Postgres DB Connections
cestring = 'postgresql://' + USERNAME + ':' + PASSWORD + '@' + HOST + '/' + DATABASE
engine = create_engine(cestring)
session = Session(engine)

# Create database if it does not exist.
if not database_exists(cestring):
    create_database(cestring)
else:
    # Connect the database if exists.
    connection = engine.connect()
    metadata = db.MetaData()

    app = Flask(__name__)

    @app.route('/')
    @app.route('/background')
    def background ():
        results = connection.execute('SELECT "State" FROM "' + BACKGROUND_TABLE + '" GROUP BY "State" ORDER BY "State"')
        background = []
        for result in results:
            background.append(result)
        return render_template('index.html', background = background)

    @app.route('/graphdata/<state>')
    def graphdata(state):
        results = connection.execute(f"""
                   Select substring("Month", 6, 7), sum("Handgun") as handgun,
                    sum("Long_Gun") as long_gun,  sum("Other") as other
                    from "{BACKGROUND_TABLE}" where "State" = '{state}' 
                    group by substring("Month", 6, 7)
                    order by substring("Month", 6, 7)
                    
                    """)
        background = []
        for result in results:
            background.append({"month": result[0], "handgun": result[1], "long_gun": result[2], "other": result[3]})

        return jsonify(background)

if __name__== '__main__': 
        app.run(debug= True)