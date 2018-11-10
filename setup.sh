exit


USER=lukeskywalker
PASS=d05e9276a97c227650cfaafbdf585ff3ed0bf54c
GROUP=jedi
ROOT_PASS=60f2d85848a55ba0b6e3218f54e557f26328d606

# NOTE: This is for Ubuntu 16.04.3 x64. There is a chance it might not work if the system isn't the same.

# Setup password for root
# password: 60f2d85848a55ba0b6e3218f54e557f26328d606
passwd

# Setup non-root admin user

adduser $USER
# password: 5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8
# Generated with: echo -n "password" | openssl sha1
usermod -aG sudo $USER

# Setup Public Key-based authentication

# Setup firewall
sudo ufw app list
sudo ufw allow OpenSSH
sudo ufw enable
#######################################
# This will reboot the droplet
sudo shutdown -r now
#######################################
sudo ufw status




# # Install Node.js v6
# curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
# sudo bash nodesource_setup.sh
# sudo apt-get install nodejs

#Install Node.js v10
curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs

# Install NVM to install node v10.1.0
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh -o install_nvm.sh
bash install_nvm.sh
source ~/.profile
nvm install 10.1.0

# Test node installation
node -v


# Test node installation
cat > test.js <<EOL
#!/usr/bin/env nodejs
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8080);
console.log('Server running at http://localhost:8080/');
console.log('Try: curl http://localhost:8080');
EOL

chmod +x ./test.js
./test.js







# Setup and Configure MongoDB

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update

sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl status mongodb

# Setup mongo user
cat | mongo <<EOL
use hoth;
db.createUser({ 
    "user": "jarjar", 
    "pwd": "191b42c3f046633dd56f4ab6266abae4237b55a8", 
    "roles": [{ 
        "db": "tatooine", 
        "role": "readWrite"
    }]  
});

db.createUser({ 
    user: "captainplanet", 
    pwd: "ac4a1ce73339c4e8ec550c701675684a71c3f7d90eb19c78042ab6b47cc46a801987c92dcadfc585d0d8b8a46943f85461945b170bee7dc83d881bfa", 
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
});
EOL

# Need mongo startup script like redis

# Test mongo
# mongo hoth -u jarjar -p 191b42c3f046633dd56f4ab6266abae4237b55a8





# Setup and Configure Redis

sudo apt-get update
sudo apt-get install build-essential tcl
cd /tmp
curl -O http://download.redis.io/redis-stable.tar.gz
tar xzvf redis-stable.tar.gz
cd redis-stable
make
make test
sudo make install

sudo mkdir /etc/redis
sudo cp /tmp/redis-stable/redis.conf /etc/redis

# Setup startup script and config for redis
sudo cat > /etc/systemd/system/redis.service <<EOL
[Unit]
Description=Redis In-Memory Data Store
After=network.target

[Service]
User=redis
Group=redis
ExecStart=/usr/local/bin/redis-server /etc/redis/redis.conf
ExecStop=/usr/local/bin/redis-cli shutdown
Restart=always

[Install]
WantedBy=multi-user.target
EOL

sudo adduser --system --group --no-create-home redis
sudo mkdir /var/lib/redis
sudo chown redis:redis /var/lib/redis
sudo chmod 770 /var/lib/redis

# Start redis
sudo systemctl start redis
sudo systemctl enable redis
# Test Redis, result should be: PONG
echo 'ping' | redis-cli
echo 'config set dir /var/lib/redis' | redis-cli
echo 'config set dbfilename temp.rdb' | redis-cli



# Setup rsync config
sudo groupadd $GROUP
sudo adduser $USER $GROUP


# Setup file permissions for file uploads
cd /home/lukeskywalker/apps/fcfm-construction-tracking/server/public/
chown -R lukeskywalker .



# Setup PM2 for process management
sudo npm install -g pm2
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER
systemctl status pm2-$USER


# Setup nginx

sudo apt-get update
sudo apt-get install nginx

sudo ufw app list
sudo ufw allow 'Nginx HTTP'
sudo ufw status
systemctl status nginx
curl -i http://fcfmn.app
#######################################
# Enable port 8020 for websocket connection
sudo ufw allow 8020



# Setup certbot for SSL on nginx
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python-certbot-nginx

sudo vi /etc/nginx/sites-available/default
# Replace:
# server_name _;
# With:
# server_name fcfmn.app;

sudo nginx -t
sudo systemctl reload nginx

sudo ufw status
sudo ufw allow 'Nginx Full'
sudo ufw delete allow 'Nginx HTTP'
sudo ufw status
sudo certbot --nginx -d fcfmn.app
# Pick option 2

# For Dev server:
# sudo certbot --nginx -d dev.fcfmn.app

sudo certbot renew --dry-run

# Setup reverse proxy server for nginx to node
sudo vi /etc/nginx/sites-available/default
# Replace everything in location with:
# location / {
#     proxy_pass http://localhost:4444;
#     proxy_http_version 1.1;
#     proxy_set_header Upgrade $http_upgrade;
#     proxy_set_header Connection 'upgrade';
#     proxy_set_header Host $host;
#     proxy_cache_bypass $http_upgrade;
# }

sudo nginx -t
sudo systemctl restart nginx




# Update file upload max size
sudo vi /etc/nginx/sites-available/default
# After the location braces add without the #:
# client_max_body_size 32m;

sudo nginx -t
sudo systemctl restart nginx



# Setup for backups
apt install zip

# SETTING UP CRON
# 1. Start Cron
# crontab -e
# 2. Append to cron
# 10 8 * * * cd /home/lukeskywalker/apps/fcfm-construction-tracking/; ./cron.sh