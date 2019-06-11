# Break Breaking out of High School  -- VIAQom

## Roles
- Vincent Chi (FrontEnd e.g. BootStrap)
- Isaac Jon (BackEnd e.g. Database)
- Ahnaf Kazi (JavaScript)
- Qian Zhou (Project Manager)

## Overview

This is an implementation of breakbreaker, including cool features such as:
- Coin feedback system that works with the game.
- Creative upgrade features that improve gameplay experience.
- Customization!

## [Video](https://www.youtube.com/watch?v=u12bg0V9F9U)

## Necessary Packages

The user can just run 
` pip install -r requirements.txt`
to install the necessary packages. 

## Launch Instructions

### Localhost

1. Thee user should [construct a virtual environment](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/) and activate it. 
2. install the necessary packages
3. run `python __init__.py` in the bbohs repository
4. go to `localhost:5000` on a browser


### Apache2

If you do not yet have an apache server, [here](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-ubuntu-18-04) is how to install it on an DO droplet. 

1. Go to `/var/www/` and clone this github repository under the name `bbohs`
2. Add www-data write permissions by inputing `sudo chgrp -R www-data bbohs` and `sudo chmod -R 777 bbohs` at the `bbohs/` directory
3. Change the Server Address in `bbohs/bbohs.conf` to the IP address of your server.
4. Move the  `bbohs.conf` file to `/etc/apache2/sites-available/`
5. Install the requirements on the first `bbohs/` directory: `sudo pip3 install -r requirements.txt`
6. Install flask: `sudo apt install python-flask` (only required if you did not install the requirements using sudo last step)
7. Enable the site: `sudo a2ensite bbohs`
8. Restart/Reload the apache server: `sudo service apache2 restart`
9. Go to the IP address you wrote in step 3 to view the website.
