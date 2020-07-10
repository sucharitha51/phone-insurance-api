Vagrant.configure("2") do |config|
  config.vm.hostname = "dev.local"
  config.vm.box = "hashicorp/bionic64"
  config.vm.network "forwarded_port", guest: 3000, host: 1337, host_ip: "127.0.0.1"
  config.vm.synced_folder ".", "/vagrant"
  config.ssh.forward_agent = true
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
  end

  # Local setup script
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update -y
    DEBIAN_FRONTEND=noninteractive apt-get upgrade -y \
       --allow-downgrades --allow-remove-essential --allow-change-held-packages
    apt-get autoremove -y
    apt-get clean -y
    apt-get install -y \
        wget \
        unzip \
        awscli \
        curl

    # Install NodeJS 12.x
    curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
    apt-get install nodejs -y

    # Install Yarn and dev dependancies for API
    cd /vagrant
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    apt update && apt install yarn
    yarn install

    # Setup MySQL DB and add username and password
    debconf-set-selections <<< 'mysql-server mysql-server/root_password password root'
    debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password root'
    apt-get install -y mysql-server
    mysql -e 'CREATE DATABASE `so-sure-node`;' -proot

    # Setup MongoDB and add username and password
    cd /vagrant/config
    wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" \
     | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
    apt-get update
    apt-get install -y mongodb-org
    service mongod start
    sleep 5s
    chmod +x ./mongo-users.sh
    ./mongo-users.sh

    # Default environment variables for local dev
    cp /vagrant/config/example.env /vagrant/.env

    # Programs we want to run on boot
    echo '#!/bin/bash' > /etc/rc.local
    chmod +x /etc/rc.local
    echo 'mongod --quiet --config /etc/mongod.conf --fork' >> /etc/rc.local #MongoDB
  SHELL
end
