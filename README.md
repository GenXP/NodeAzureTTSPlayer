# Ampule

Integration with Microsoft Azure Speech Synthesis for local-area playback of generated speech.

# Running

cd ~
wget https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh
sh install.sh
source ~/.bashrc
nvm install v20.10.0
sudo apt install libasound2-dev -y
cd ~
git clone https://github.com/GenXP/NodeAzureTTSPlayer.git
cd NodeAzureTTSPlayer
npm install
node app.js

# Configuration

Create a "local.json" in ./config and override any attributes you would like. Don't commit ./config/local.json to the repository.
