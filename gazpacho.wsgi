#!/usr/bin/python3
#activate_this = '/var/www/gazpacho/gazpacho/viaq/bin/activate_this.py'
#execfile(activate_this, dict(__file__=activate_this))

import sys
sys.path.insert(0,"/var/www/gazpacho/")
sys.path.insert(0,"/var/www/gazpacho/gazpacho/")

from gazpacho import app as application
