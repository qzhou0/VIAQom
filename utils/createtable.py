import sqlite3

dbfile = "../data/userdata.db"

db = sqlite3.connect(dbfile)

c = db.cursor()

"""Create the database if not already created"""

command = "CREATE TABLE IF NOT EXISTS users(username TEXT, password TEXT, displayname TEXT, coins INTEGER)"
c.execute(command)

command = "CREATE TABLE IF NOT EXISTS upgrades(username TEXT, upgrade TEXT, tier INTEGER)"
c.execute(command)

command = "CREATE TABLE IF NOT EXISTS highscores(username TEXT, score INTEGER)"
c.execute(command)

db.commit()
db.close()
