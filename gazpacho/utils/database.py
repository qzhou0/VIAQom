import sqlite3
import random

dbfile = "data/userdata.db"

def initdb():
    return sqlite3.connect(dbfile)


def createTable():
    db = initdb()
    c = db.cursor()
    """Create the database if not already created"""

    command = "CREATE TABLE IF NOT EXISTS users(username TEXT, password TEXT, displayname TEXT, coins INTEGER)"
    c.execute(command)

    command = "CREATE TABLE IF NOT EXISTS upgrades(username TEXT, upgrade TEXT, tier INTEGER)"
    c.execute(command)

    command = "CREATE TABLE IF NOT EXISTS highscores(username TEXT, score INTEGER)"
    c.execute(command)

def checkuser(user):
    db = initdb()
    c = db.cursor()

    c.execute("SELECT * FROM users WHERE username = ?", (user, ))
    dupusers = c.fetchall()

    db.close()

    return len(dupusers) > 0

def getpassword(user):
    db = initdb()
    c = db.cursor()

    c.execute("SELECT password FROM users WHERE username = ?", (user, ))
    password = c.fetchone()[0]

    db.close()

    return password

def resetpassword(user, newpass):
    db = initdb()
    c = db.cursor()

    c.execute("UPDATE users SET password = ? WHERE username = ?", (newpass, user))

    db.commit()
    db.close()

def loginuser(user, password):
    db = initdb()
    c = db.cursor()

    c.execute("SELECT * FROM users WHERE username = ? AND password = ?", (user, password))
    creds = c.fetchall()

    db.close()

    return len(creds) > 0

def newuser(user, password):
    randName = random.randint(0, 200)

    db = initdb()
    c = db.cursor()

    c.execute("INSERT INTO users VALUES(?,?,?,?)", (user, password,str(randName), 1000))
    c.execute("INSERT INTO upgrades VALUES(?,?,?)", (user, "Extra Ball", 0))
    c.execute("INSERT INTO upgrades VALUES(?,?,?)", (user, "Explosive Ball", 0))
    c.execute("INSERT INTO upgrades VALUES(?,?,?)", (user, "Rocket Ball", 0))
    c.execute("INSERT INTO upgrades VALUES(?,?,?)", (user, "Income Multiplier", 0))


    db.commit()
    db.close()

    return True

def fetchupgrades(user):
    db = initdb()
    c = db.cursor()
    c.execute("SELECT upgrade,tier FROM upgrades WHERE username = ?", (user, ))
    upgrades = c.fetchall()

    db.close()

    return upgrades

def addupgrade(user, upg, ti):
    db = initdb()
    c = db.cursor()
    if checkupgrade(user, upg):
        c.execute("UPDATE upgrades SET tier = ? WHERE username = ?", (newpass, user))

def checkupgrade(user, upg):
    db = initdb()
    c = db.cursor()
    c.execute("SELECT upgrade FROM upgrades WHERE username = ? AND upgrade = ?", (user, upg))

    res = c.fetchall()

    return len(res) > 0


def changecoins(user, newcoins):
    db = initdb()
    c = db.cursor()

    c.execute("UPDATE users SET coins = ? WHERE username = ?", (newcoins, user))

    db.commit()
    db.close()

def fetchcoins(user):
    db = initdb()
    c = db.cursor()

    c.execute("SELECT coins FROM users WHERE username = ?", (user, ))
    coins = c.fetchone()[0]

    db.close()

    return coins

# def formatmatchdata(endchips, rank, time):
#     return endchips + ":" + rank + ":" + time + ";"
#
# def addpastmatch(user, match):
#     db = initdb()
#     c = db.cursor()
#
#     c.execute("SELECT match_history FROM users WHERE username = ?", (user, ))
#     match_history = c.fetchone()[0]
#     if match_history == None or match_history == "":
#         c.execute("UPDATE users SET match_history = ? WHERE name = ?", (match, user))
#     else:
#         c.execute("UPDATE users SET match_history = ? WHERE name = ?", (match + match_history, user))
#
#     db.commit()
#     db.close()
#
# def deformatmatch(match):
#     return match.split(":")
#
# def getpastmatches(user):
#     db = initdb()
#     c = db.cursor()
#
#     c.execute("SELECT match_history FROM users WHERE name = ?", (user, ))
#     match_history = c.fetchone()[0]
#
#     if match_history == "" or match_history == None:
#         return ""
#     else:
#         match_history = match_history.split(";")
#
#     while match_history[-1] == "":
#         match_history = match_history[0:-1]
#
#     for i in range(len(match_history)):
#         currmatch = deformatmatch(match_history[i])
#         match_history[i] = {"time": currmatch[2], "chips": int(currmatch[0]), "rank": int(currmatch[1])}
#
#     db.close()
#
#     return match_history
#
# def formatcurrdata(chips, playername):
#     return chips + ":" + playername
#
# def addcurrmatch(user, match):
#     db = initdb()
#     c = db.cursor()
#
#     c.execute("UPDATE users SET current_games = ? WHERE name = ?", (match, user))
#
#     db.commit()
#     db.close()
#
# def readcurrmatch(user):
#     db = initdb()
#     c = db.cursor()
#
#     c.execute("SELECT current_games FROM users WHERE name = ?", (user, ))
#     currmatch = c.fetchone()[0]
#
#     db.close()
#
#     return currmatch
#
# def checkcurrmatch(user):
#     db = initdb()
#     c = db.cursor()
#
#     c.execute("SELECT current_games FROM users WHERE name = ?", (user, ))
#     currmatch = c.fetchone()[0]
#     rtrnval = (currmatch != "" and currmatch != None)
#
#     db.close()
#
#     return rtrnval
#
# def clearcurrmatch(user):
#     db = initdb()
#     c = db.cursor()
#
#     c.execute("UPDATE users SET current_games = ? WHERE name = ?", ("", user))
#
#     db.commit()
#     db.close()
