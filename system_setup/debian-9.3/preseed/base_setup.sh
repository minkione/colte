#!/bin/bash

sudo apt-get -y install git
git clone https://github.com/uw-ictd/colte.git /home/$USER/colte
/home/$USER/colte/system_setup/debian-9.3/setup-debian-9.3.sh
