# VIAQom - Ahnaf Kazi, Isaac Jon, Qian Zhou, Vincent Chi
# SoftDev1 pd8

import os
import random
import datetime
import json

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


@app.route('/', methods=['POST','GET'])
def home():
    '''
    Generates mainpage. Passes user info.
    '''
    if request.method=='POST':
        print('POST')
        result=database.fetchupgrades(user)
        return json.dumps(result)
        resp=make_response('{"response":'+result+'}')
        resp.headers['Content-Type']="application/json"
        return resp
    if user in session:
        return render_template('landing.html', coins = database.fetchcoins(user), username = user, alerts=[], errors = True, logged_in = True, upgrades = database.fetchupgrades(user))
    return render_template('index.html', username = "", errors = True, logged_in = False)

@app.route('/register')
def register():
    '''
    Generates register page after pressing register. Checks session.
    '''
    if user in session:
        return redirect(url_for('home'))
    return render_template('register.html',username = "", logged_in=False)

@app.route('/login')
def loginpage():
    '''
    Generates register page after pressing register. Checks session.
    '''
    if user in session:
        return redirect(url_for('home'))
    return render_template('index.html',username = "", logged_in=False)

@app.route('/login', methods=['POST'])
def login():
    '''
    Generates login page after successfully entering correct credentials. Checks session.
    '''
    if user in session:
        return redirect(url_for('home'))
    return render_template('landing.html',username = "", alerts=[], logged_in=False, game=database.readcurrmatch(user))

@app.route('/authenticate', methods=['POST','GET'])#for some reason returns Method Not ALlowed without 'GET'
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
        return render_template("index.html", username = "", errors = True, alerts=["Your username password combination was incorrect. Please try again."], logged_in = False)
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
        coins = database.fetchcoins(user)
        upgrades = database.fetchupgrades(user)
        return render_template('profile.html', username = user, coins = coins, upgrades = upgrades, logged_in = True)
    return render_template('index.html', username = "", errors = True, logged_in = False)

@app.route('/store')
def store():
    '''
    Generates store page after pressing store button. Checks session.
    '''
    if user in session:
        coins = database.fetchcoins(user)
        upgrades = database.fetchupgrades(user)
        return render_template('store.html', username = user, coins = coins, upgrades = upgrades, logged_in = True)
    return render_template('index.html', username = "", errors = True, logged_in = False)

@app.route('/buy')
def buy():
    '''
    Buys upgrade, deducts the price from user's wallet, increases the tier of the selected upgrade
    '''
    if user in session:
        coins = database.fetchcoins(user)
        upgrades = database.fetchupgrades(user)
        if not(database.buyupgrade(user, request.args["buybutton"])):
            return render_template('store.html', username = user, coins = coins, upgrades = upgrades, alerts = ["Sorry, insufficient funds"], logged_in = True)
        else:
            coins = database.fetchcoins(user)
            upgrades = database.fetchupgrades(user)
            return render_template('store.html', username = user, coins = coins, upgrades = upgrades, logged_in = True)
    return render_template('index.html', username = "", errors = True, logged_in = False)

@app.route('/changepass')
def changepass():
    '''
    Generates change password page as an option from the profile page. Checks session.
    '''
    if user in session:
        coins = database.fetchcoins(user)
        upgrades = database.fetchupgrades(user)
        return render_template('changepass.html', username=user, coins = coins, upgrades = upgrades, alerts=[], logged_in = True)
    return render_template('index.html', username = "", errors = True, logged_in = False)

@app.route('/updatepass', methods=["GET","POST"])
def updatepass():
    '''
    Communicates with database to change password.
    '''
    if user in session:
        coins = database.fetchcoins(user)
        upgrades = database.fetchupgrades(user)
        passeq = (request.form["pass"] == request.form["verpass"])
        passdiff = (request.form["pass"] != database.getpassword(user))
        if passeq and passdiff:
            database.resetpassword(user, request.form["pass"])
            return render_template('landing.html', username = user, coins = coins, upgrades = upgrades, errors = True, alerts=["Successfully changed password"], logged_in = True)
        if not passeq:
            return render_template("changepass.html", username=user, coins = coins, upgrades = upgrades, alerts=["Passwords do not match"], logged_in = True)
        if not passdiff:
            return render_template("changepass.html", username=user, coins = coins, upgrades = upgrades, alerts=["New password is not different from current password"], logged_in = True)
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

@app.route('/endgame', methods=['POST','GET'])
def endgame():
    '''
    process information after the game has ended, for ajax calls
    '''
    if request.method == 'POST':
        #print(request)
        points=request.form['gains']
        print('changing coins')
        database.changecoins(user,int(points),1)
        return ''
    return redirect(url_for('home'))


if __name__ == '__main__':
    app.debug = True
    app.run()
