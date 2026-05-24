/**
 * API smoke tests for profile + auth validation + forgot password.
 * Run: node scripts/testProfileAuthApi.js
 * Requires server on PORT (default 5000) and MongoDB connected.
 */
import "../src/config/env.js";

const BASE = `http://localhost:${process.env.PORT || 5000}`;
const testEmail = `test_${Date.now()}@levelup.dev`;
const testUser = `testuser_${Date.now()}`;
const testPassword = "testpass123";

let cookie = "";

const request = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (cookie) headers.Cookie = cookie;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    const match = setCookie.match(/token=([^;]+)/);
    if (match) cookie = `token=${match[1]}`;
  }

  let body;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { status: res.status, body };
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const run = async () => {
  console.log("=== LevelUp Profile & Auth API Tests ===\n");

  // 1. Register validation
  let res = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username: "ab", email: "bad", password: "123" }),
  });
  assert(res.status === 400, "Register should reject invalid input");
  console.log("✓ Register validation");

  // 2. Register success
  res = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username: testUser,
      email: testEmail,
      password: testPassword,
    }),
  });
  assert(res.status === 201 && res.body.success, "Register should succeed");
  console.log("✓ Register user");

  // 3. Login
  res = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  });
  assert(res.status === 200 && res.body.user?.username === testUser, "Login failed");
  console.log("✓ Login user");

  // 4. Profile GET
  res = await request("/api/user/profile");
  assert(res.status === 200 && res.body.success, "Profile GET failed");
  assert(res.body.user?.email === testEmail, "Profile user email mismatch");
  console.log("✓ GET /api/user/profile");

  // 5. Profile UPDATE
  res = await request("/api/user/update", {
    method: "PUT",
    body: JSON.stringify({
      bio: "Test bio from API",
      language: ["Python", "JavaScript"],
      avatar: "🐱",
      github: "https://github.com/test",
    }),
  });
  assert(res.status === 200 && res.body.user?.bio === "Test bio from API", "Update failed");
  console.log("✓ PUT /api/user/update");

  // 6. Forgot password
  res = await request("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email: testEmail }),
  });
  assert(res.status === 200 && res.body.success, "Forgot password failed");
  assert(res.body.resetToken, "Reset token should be returned in dev");
  console.log("✓ POST /api/auth/forgot-password");

  // 7. Reset password
  const newPassword = "newpass456";
  res = await request("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token: res.body.resetToken, password: newPassword }),
  });
  assert(res.status === 200 && res.body.success, "Reset password failed");
  console.log("✓ POST /api/auth/reset-password");

  // 8. Login with new password
  cookie = "";
  res = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: testEmail, password: newPassword }),
  });
  assert(res.status === 200, "Login with new password failed");
  console.log("✓ Login with reset password");

  console.log("\n=== All tests passed ===");
};

run().catch((err) => {
  console.error("\n✗ Test failed:", err.message);
  process.exit(1);
});
