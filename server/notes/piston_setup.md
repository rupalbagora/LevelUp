🧠 BIG PICTURE
Windows → WSL (Linux) → Docker → Piston API → Code Execution

1. Setup WSL (Linux inside Windows)

👉 Why?
Docker + Piston needs Linux features

wsl --install -d Ubuntu

2. Open WSL (Ubuntu terminal)
wsl

👉 You should see:

username@DESKTOP:~$

3. Enable Docker in WSL

👉 In Docker Desktop:

Settings → Resources → WSL Integration
Enable Ubuntu ✅

4. Verify Docker
docker ps

👉 If no error → ready ✅

5. Clone Piston repo
cd ~
git clone https://github.com/engineer-man/piston
cd piston

6. Create docker-compose setup

👉 You fixed this final version:

services:
  api:
    image: ghcr.io/engineer-man/piston
    container_name: piston_api
    restart: always
    privileged: true
    ports:
      - "2000:2000"
    volumes:
      - ./data/piston:/piston
    tmpfs:
      - /tmp:exec

7. Start container
docker compose up -d

8. Check container
docker ps

9. Check API is alive
curl http://localhost:2000/api/v2/runtimes

👉 Output:

[]

10. Install runtimes (IMPORTANT)

👉 Python:

curl -X POST http://localhost:2000/api/v2/packages \
-H "Content-Type: application/json" \
-d '{"language":"python","version":"3.10.0"}'

👉 JavaScript:

curl -X POST http://localhost:2000/api/v2/packages \
-H "Content-Type: application/json" \
-d '{"language":"node","version":"18.15.0"}'

👉 Java:

curl -X POST http://localhost:2000/api/v2/packages \
-H "Content-Type: application/json" \
-d '{"language":"java","version":"15.0.2"}'

11. Verify runtimes
curl http://localhost:2000/api/v2/runtimes

12. Execute code

👉 Example:

curl -X POST http://localhost:2000/api/v2/execute \
-H "Content-Type: application/json" \
-d '{
  "language": "python",
  "version": "3.10.0",
  "files": [
    { "content": "print(\"Hello World\")" }
  ]
}

13. Test persistence
docker restart piston_api
curl http://localhost:2000/api/v2/runtimes

👉 Runtimes still there ✅

----------------

🧠 KEY CONCEPTS YOU LEARNED
🔹 1. WSL

👉 Linux inside Windows
👉 Required for Docker compatibility

🔹 2. Docker Container
Temporary environment
🔹 3. Docker Volume
Permanent storage

👉 Fix for runtime loss

🔹 4. API-based execution
POST /execute → run code

--------------------

5. Debugging mindset

You handled:

❌ EOF errors
❌ checksum mismatch
❌ container crashes
❌ API format errors

👉 This is real engineering

🔥 1. EOF Error (Download Interrupted)
❌ Error:
unexpected EOF
👉 What it means:

Download stopped midway

🧠 How you handled it:
You didn’t panic
You retried download
Cleared Docker cache
✅ Fix you applied:
docker system prune -a
docker pull ...
💡 Lesson:

👉 EOF = network interruption

🔥 2. Checksum Mismatch (Corrupted File)
❌ Error:
checksum mismatch
👉 Meaning:

File downloaded is corrupted

🧠 Your approach:
Checked logs (docker logs)
Understood it’s a bad download
Cleaned environment
✅ Fix:
docker compose down -v
docker system prune -a
💡 Lesson:

👉 checksum error = bad/corrupt data → clean + retry

🔥 3. Container Crashes
❌ Problem:
container exits immediately
👉 Meaning:

Something inside container failed

🧠 What you did:
Ran:
docker ps -a
docker logs <container>

👉 This is exactly what engineers do

Root cause:
Missing permissions
Wrong environment (Windows vs WSL)
✅ Fix:
Used --privileged
Switched to WSL
Fixed Docker environment
💡 Lesson:

👉 Always check logs → they tell the truth

🔥 4. API Format Errors
❌ Error:
files is required
👉 Meaning:

Request body is wrong

🧠 What you did:
Read error carefully
Updated request format
From:
{ "source": "code" }
To:
{
  "files": [
    { "content": "code" }
  ]
}
💡 Lesson:

👉 API errors = input mismatch