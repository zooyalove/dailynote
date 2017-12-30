#!/bin/bash
echo "============================================"
echo "==!! Purunsystem DailyNote APP Solution !!=="
echo "============================================"
echo ""
echo "DailyNote - Do you start this app with PM2?"
echo "(y)es or (N)o"
read pm2choice
if [ "$pm2choice" = "y" ]; then
    which pm2
    if [ "$?" -ne "0" ]; then
        echo "========================="
        echo " DailyNote - Install PM2 "
        echo "========================="
        sudo npm install -g pm2
    fi
fi
echo "==========================="
echo "DailyNote - Install MongoDB"
echo "==========================="
which mongo
if [ "$?" -ne "0" ]; then
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
    sudo apt-get update && sudo apt-get install -y mongodb-org
    sudo systemctl start mongod && sudo systemctl enable mongod
fi
echo "DailyNote - MongoDB Installed"
echo ""
echo "==================================="
echo " DailyNote - Install NPM Libraries "
echo "==================================="
sudo npm install
echo "DailyNote - Finished"
echo ""
echo "DailyNote - Start DailyNote and set to start on boot?"
echo "(y)es or (N)o"
read startDailyNote
if [ "$startDailyNote" = "y" ]; then
    cd server
    sudo pm2 start deploy.config.json
    sudo pm2 startup
    sudo pm2 save
    sudo pm2 list
fi