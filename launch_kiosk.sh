#!/bin/bash

# script for launching backend server and dashboard in kiosk mode on the PI

# set env vars API keys
export ApiKeyAlphavantage="REPLACE WITH YOUR OWN KEYS"
export ApiKeyNYTimes="REPLACE WITH YOUR OWN KEYS"

# go to local project dir
cd /home/pi/projects/capital-market-kiosk
# activate venv
source venv/bin/activate
# start local server and open dashboard in kiosk mode
python3 app.py & chromium-browser --kiosk  http://127.0.0.1:4999/ ; fg
# at first start set zoom level in browser, will be remembered