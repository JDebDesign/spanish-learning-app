# Deployment Guide – Step by Step

## 1. Push to GitHub (do this first)

Your token needs the `workflow` scope to push `.github/workflows/`:

```bash
gh auth refresh -s workflow -h github.com
```

A browser window will open. Enter the code shown in the terminal and approve. Then:

```bash
git push -u origin main
```

---

## 2. M3: Create Amplify app

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/home#/create)
2. **Host web app** → Connect to **GitHub**
3. Authorize AWS to access GitHub if prompted
4. Select repo **spanish-learning-app**, branch **main**
5. Confirm build settings:
   - **Build specification**: `amplify.yml` (detected)
   - Base directory: empty
6. (Optional) Add env var: `VITE_BACKEND_URL` = `http://<EC2_IP>:8080` (add after EC2 is ready)
7. **Save and deploy**

---

## 3. M4: Create EC2 instance

1. Go to [Launch Instance](https://console.aws.amazon.com/ec2/home#LaunchInstance)
2. **Name**: `spanish-app-server`
3. **AMI**: Amazon Linux 2023 or Ubuntu 22.04
4. **Instance type**: t3.micro (free tier)
5. **Key pair**: Create new → download the `.pem` file → keep it safe
6. **Security group**: Create new
   - SSH (22): My IP
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0
   - Custom TCP 8080: 0.0.0.0/0
7. **Launch**
8. **Note the public IPv4 address** (e.g. `54.123.45.67`)

---

## 4. M5: GitHub Secrets

1. Go to `https://github.com/JDebDesign/spanish-learning-app/settings/secrets/actions`
2. **New repository secret** for each:

| Secret           | Value                                      |
|------------------|--------------------------------------------|
| `PRODUCTION_SSH` | Full contents of your `.pem` file          |
| `PRODUCTION_HOST`| EC2 public IP (e.g. `54.123.45.67`)       |
| `PRODUCTION_USER`| `ec2-user` (Amazon Linux) or `ubuntu`      |

---

## 5. M6: EC2 one-time setup

SSH into your instance:

```bash
ssh -i /path/to/your-key.pem ec2-user@<EC2_IP>
```

Then run the setup script (installs Docker, clones repo, creates `.env`):

```bash
curl -sSL https://raw.githubusercontent.com/JDebDesign/spanish-learning-app/main/scripts/ec2-setup.sh | bash
```

*If the repo isn't pushed yet*, clone and run manually:
```bash
git clone https://github.com/JDebDesign/spanish-learning-app.git ~/spanish-app && cd ~/spanish-app && bash scripts/ec2-setup.sh
```

**Log out and back in** so the `docker` group takes effect:

```bash
exit
ssh -i /path/to/your-key.pem ec2-user@<EC2_IP>
```

---

## Verify

| Component | Check |
|-----------|-------|
| **Frontend** | Open Amplify app URL (e.g. `https://main.xxx.amplifyapp.com`) |
| **Backend** | `curl http://<EC2_IP>:8080/` or `curl http://<EC2_IP>:8080/actuator/health` |

---

## Deploy

```bash
git push origin main
```

- **Frontend**: Amplify builds automatically
- **Backend**: Deploys only when `packages/java/**` changes
