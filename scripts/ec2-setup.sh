#!/bin/bash
# M6: Run this script on your EC2 instance after first SSH login
# Usage: curl -sSL https://raw.githubusercontent.com/JDebDesign/spanish-learning-app/main/scripts/ec2-setup.sh | bash
# Or: bash ec2-setup.sh (after cloning repo)

set -e

echo "==> Updating system..."
if command -v yum &>/dev/null; then
  sudo yum update -y
  sudo yum install -y docker docker-compose-plugin git
  sudo systemctl start docker && sudo systemctl enable docker
  sudo usermod -aG docker "$(whoami)"
elif command -v apt-get &>/dev/null; then
  sudo apt-get update -y && sudo apt-get install -y docker.io docker-compose-plugin git
  sudo systemctl start docker && sudo systemctl enable docker
  sudo usermod -aG docker "$(whoami)"
else
  echo "Unsupported OS. Install Docker and git manually."
  exit 1
fi

echo "==> Cloning repo..."
PROJECT_DIR="$HOME/spanish-app"
mkdir -p "$PROJECT_DIR"
if [ -d "$PROJECT_DIR/.git" ]; then
  cd "$PROJECT_DIR" && git pull origin main
else
  git clone https://github.com/JDebDesign/spanish-learning-app.git "$PROJECT_DIR"
  cd "$PROJECT_DIR"
fi

echo "==> Creating .env..."
if [ ! -f "$PROJECT_DIR/.env" ]; then
  echo "# Future env vars for Spanish App backend" > "$PROJECT_DIR/.env"
  echo "Created .env"
else
  echo ".env already exists"
fi

echo "==> Verifying Docker..."
docker --version
docker compose version 2>/dev/null || docker-compose --version

echo ""
echo "Done! Next: Add GitHub secrets (PRODUCTION_SSH, PRODUCTION_HOST, PRODUCTION_USER), then push to main to trigger deploy."
