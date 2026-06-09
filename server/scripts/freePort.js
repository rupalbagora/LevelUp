import { execSync } from "child_process";

const port = process.env.PORT || 5000;

const freePort = () => {
  if (process.platform !== "win32") return;

  try {
    const output = execSync(`netstat -ano | findstr :${port}`, {
      encoding: "utf8",
    });

    const pids = new Set();
    output
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.includes("LISTENING"))
      .forEach((line) => {
        const pid = line.split(/\s+/).pop();
        if (pid && pid !== "0") pids.add(pid);
      });

    pids.forEach((pid) => {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        console.log(`Freed port ${port} (stopped PID ${pid})`);
      } catch {
        // ignore
      }
    });
  } catch {
    // port already free
  }
};

freePort();
