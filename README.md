# Spanish Learning App

MVP Spanish chorus learning app with synced lyrics highlighting.

## Run locally

```bash
# From project root
npm install
npm run frontend:dev
```

Open http://localhost:3000

### Backend (optional)

```bash
cd packages/java && mvn spring-boot:run
```

Backend runs at http://localhost:8080. Health: http://localhost:8080/actuator/health

## Deployment

### Prerequisites

- Node 18+, Java 21, Maven, Git
- (Optional) GitHub CLI (`brew install gh`), AWS CLI

### One-time setup

1. **GitHub repo** – `gh repo create spanish-learning-app --public --source=. --remote=origin --push`, or create manually and push
2. **AWS Amplify** – Host web app → Connect GitHub → Select repo `spanish-learning-app`, branch `main`, build spec: `amplify.yml`
3. **EC2 instance** – t3.micro, Amazon Linux 2023 or Ubuntu 22.04; allow SSH (22), HTTP (80), HTTPS (443), Custom TCP 8080
4. **GitHub Secrets** – `PRODUCTION_SSH` (full `.pem` contents), `PRODUCTION_HOST` (EC2 IP), `PRODUCTION_USER` (`ec2-user` or `ubuntu`)
5. **EC2 one-time** – Install Docker, clone repo to `~/spanish-app`, create `.env` (e.g. `echo "# Future env vars" > .env`)

### Deploy

```bash
git push origin main
```

- **Frontend**: Amplify builds and deploys on every push
- **Backend**: GitHub Actions deploys to EC2 when `packages/java/**` changes

### Verify

- **FE**: Open Amplify app URL (e.g. `https://main.xxx.amplifyapp.com`)
- **BE**: `curl http://<EC2_IP>:8080/` or `curl http://<EC2_IP>:8080/actuator/health`

### Troubleshooting

- **CORS**: Add `@CrossOrigin` on backend controllers or configure CORS in Spring Boot
- **Env vars**: Check Amplify env (e.g. `VITE_BACKEND_URL`) and EC2 `.env`
- **Logs**: `docker logs spanish-app-backend`, Amplify build logs

## Features

- **Lyrics sync**: Active chorus line highlights while audio plays
- **Tap to seek**: Click a lyric line to jump to that part of the song
- **Progress bar**: Slider to scrub playback
- **Word tooltips**: Click Spanish words for meaning, root, context, and pronunciation
- **Waveform Timing Tool**: Developer mode to generate lyric timestamps

## Generate timestamps with Waveform Tool

1. In [ChorusPlayer.tsx](packages/frontend/src/pages/chorus/ChorusPlayer.tsx), set:
   ```ts
   const ENABLE_TIMING_TOOL = true
   ```
2. Run the app and you'll see the Waveform Timing Tool
3. Click the waveform to set **start** time for the current line
4. Click again to set **end** time (moves to next line)
5. Use the play button to preview
6. Click **Export** to copy timings to clipboard
7. Paste into [lyricsTiming.ts](packages/frontend/src/shared/data/lyricsTiming.ts)
8. Set `ENABLE_TIMING_TOOL = false` to return to normal player

## Audio file

The app loads `/songs/dtmf-bad-bunny.mp3` from the frontend public folder.

Original file: `DtMF - Bad Bunny.mp3` (copied and renamed to avoid spaces).
