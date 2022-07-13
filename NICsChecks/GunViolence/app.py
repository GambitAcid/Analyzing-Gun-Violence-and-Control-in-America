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

    @app.route('/sankey')
    def sankey ():
        return render_template('sankey.html')


    @app.route('/sankey_data')
    def sankey_data():
        # # get gender list
        # gender_list = []
        # rs = connection.execute("""
        #     select gender from "MassShootings"    group by gender
        # """)

        # for row in rs:
        #     gender_list.append(row[0])
            
        # # get type list
        # type_list = []
        # rs = connection.execute("""
        #     select type from "MassShootings"  group by type
        # """)

        # for row in rs:
        #     type_list.append(row[0])
            
        # # get location type list
        # location_list = []
        # rs = connection.execute("""
        #     select location_type from "MassShootings"  group by location_type
        # """)

        # for row in rs:
        #     location_list.append(row[0])
            
        # print(gender_list)
        # print(type_list)
        # print(location_list)

        # labels = []
        # labels += gender_list
        # labels += type_list
        # labels += location_list
        # print(labels)

        # base don this, get source and target, value
        # source = []
        # target = []
        # value = []

        data = []

        # 1. gender -> type
        rs = connection.execute("""
            select count(*) as cnt, gender, type
            from "MassShootings"
            group by gender, type
            order by gender, type
        """)


        for row in rs:
            cnt = row[0]
            f1 = row[1]
            f2 = row[2]
            
            data.append({"from": f1, "to": f2, "flow": cnt})
                
        # 2. gender -> location_type
        rs = connection.execute("""
            select count(*) as cnt, gender, location_type
            from "MassShootings"
            group by gender, location_type
            order by gender, location_type
        """)


        for row in rs:
            cnt = row[0]
            f1 = row[1]
            f2 = row[2]
            
            data.append({"from": f1, "to": f2, "flow": cnt})
                
                
        # 2. type -> location_type
        rs = connection.execute("""
            select count(*) as cnt, type, location_type
            from "MassShootings"
            group by type, location_type
            order by type, location_type
        """)


        for row in rs:
            cnt = row[0]
            f1 = row[1]
            f2 = row[2]
            
            data.append({"from": f1, "to": f2, "flow": cnt})
                
        # print(source)
        # print(target)
        # print(value)

        return jsonify(data)

if __name__== '__main__': 
        app.run(debug= True)