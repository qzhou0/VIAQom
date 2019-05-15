# VIAQom - Ahnaf Kazi, Isaac Jon, Qian Zhou, Vincent Chi
# SoftDev1 pd8

import os
import random
import ssl
import datetime

ssl._create_default_https_context = ssl._create_unverified_context

from flask import Flask, redirect, url_for, render_template, session, request, flash, get_flashed_messages

from utils import database


# instantiate Flask object
app = Flask(__name__)
app.secret_key = os.urandom(32)

# manage cookies and user data here
user = None
chip = "global"

def setUser(userName):
    '''
    Sets username to be passed to html files.
    '''
    global user
    user = userName


@app.route('/')
def home():
    '''
    Generates mainpage. Passes user info.
    '''
    if user in session:
        if int(database.fetchchips(user)) < 0:
            return render_template("index.html", username = "", errors = True, alerts=["You have no chips left. Account suspended."], logged_in = False)
        return render_template('landing.html', username = user, alerts=[], errors = True, logged_in = True, game=database.readcurrmatch(user))
    return render_template('index.html', username = "", errors = True, logged_in = False)

@app.route('/register')
def register():
    '''
    Generates register page after pressing register. Checks session.
    '''
    if user in session:
        return redirect(url_for('home'))
    return render_template('register.html',username = "", logged_in=False)

@app.route('/play')
def newgame():
    '''
    Brings up the game's html after starting/continuing game. Checks session.
    '''
    if user in session:
        if int(database.fetchchips(user)) < 0:
            return render_template("index.html", username = "", errors = True, alerts=["You have no chips left. Account suspended."], logged_in = False)
        return render_template('poker.html', bank = 500, username = user, logged_in=True)
    return render_template('index.html', username = "", errors = True, logged_in = False)

@app.route('/playagain', methods=['GET', 'POST'])
def newgame2():
    '''
    Short circuits restarting the game.
    '''
    winnings = 0;
    if request.method == 'POST':
        winnings = int(request.form['mydata'])
        database.changechips(user,database.fetchchips(user) + winnings - 500)
        return ""

@app.route('/getrank', methods=['GET', 'POST'])
def getrank():
    '''
    Passes rank for database/match history purposes.
    '''
    if request.method == 'POST':
        place = (request.form['mydata'])
        now = datetime.datetime.now()
        database.addpastmatch(user,database.formatmatchdata(str(database.fetchchips(user)), str(place), now.strftime("%m/%d/%Y   %H'%M")))
        return ""

@app.route('/login', methods=['POST'])
def login():
    '''
    Generates login page after successfully entering correct credentials. Checks session.
    '''
    if user in session:
        return redirect(url_for('home'))
    return render_template('landing.html',username = "", alerts=[], logged_in=False, game=database.readcurrmatch(user))

@app.route('/authenticate', methods=['POST'])
def authenticate():
    '''
    Checks user and pass. Makes login and register work. Checks session.
    '''
    if user in session:
        return redirect(url_for('home'))
    # instantiates DB_Manager with path to DB_FILE
    username, password, curr_page = request.form['username'], request.form['password'], request.form['address']
    # LOGGING IN
    if request.form["submit"] == "Login":
        if username != "" and password != "" and database.loginuser(username, password):
            session[username] = password
            setUser(username)
            return redirect(curr_page)
        return render_template("index.html", username = "", errors = True, alerts=["Incorrect Credentials"], logged_in = False)
    # REGISTERING
    if request.form["submit"] == "Register":
        if len(username.strip()) != 0 and not database.checkuser(username):
            if len(password.strip()) != 0:
                # add account to DB
                database.newuser(username, password)
                flash('Successfully registered account for user  "{}"'.format(username))
                return redirect(url_for('home'))
            else:
                flash('Password length insufficient')
        elif len(username) == 0:
            flash('Username length insufficient')
        else:
            flash('Username already taken!')
        # Try to register again
        return render_template('register.html', username = "", errors = True)

@app.route('/logout')
def logout():
    '''
    Logs user out. Redirects to homepage.
    '''
    curr_page = request.args['address']
    session.pop(user, None)
    setUser(None)
    flash('Successfully logged out!')
    return redirect(curr_page)

@app.route('/profile')
def profile():
    '''
    Generates profile page after pressing profile button. Checks session.
    '''
    if user in session:
        chips = database.fetchchips(user)
        return render_template('profile.html', username = user, numchips=chips, matches=database.getpastmatches(user), logged_in = True)
    return render_template('index.html', username = "", errors = True, logged_in = False)

@app.route('/changepass')
def changepass():
    '''
    Generates change password page as an option from the profile page. Checks session.
    '''
    if user in session:
        return render_template('changepass.html', username=user, alerts=[], logged_in = True)
    return render_template('index.html', username = "", errors = True, logged_in = False)

@app.route('/updatepass', methods=["POST"])
def updatepass():
    '''
    Communicates with database to change password.
    '''
    if user in session:
        passeq = (request.form["pass"] == request.form["verpass"])
        passdiff = (request.form["pass"] != database.getpassword(user))
        if passeq and passdiff:
            database.resetpassword(user, request.form["pass"])
            return render_template('landing.html', username = user, errors = True, alerts=["Successfully changed password"], logged_in = True, game=database.readcurrmatch(user))

        passerrs = []
        if not passeq:
            passerrs.append("Passwords not the same")
        if not passdiff:
            passerrs.append("Password cannot be the same as previous password")
        return render_template("changepass.html", username=user, alerts=passerrs, logged_in = True)
    return render_template('index.html', username = "", errors = True, logged_in = False)

@app.route('/clearcurrmatch')
def clearmatchinprogress():
    '''
    Clears match in progress. Checks session.
    '''
    if user in session:
        database.clearcurrmatch(user)
        return render_template('profile.html', username = user, numchips=database.fetchchips(user), matches=database.getpastmatches(user), logged_in = True, alerts=["Current Match Cleared"])
    return render_template('index.html', username = "", errors = True, logged_in = False)

if __name__ == '__main__':
    app.debug = True
    app.run()
