#!/usr/bin/python3
#activate_this = '/var/www/bbohs/bbohs/viaq/bin/activate_this.py'
#execfile(activate_this, dict(__file__=activate_this))

import sys
sys.path.insert(0,"/var/www/bbohs/")
sys.path.insert(0,"/var/www/bbohs/bbohs/")

from bbohs import app as application
