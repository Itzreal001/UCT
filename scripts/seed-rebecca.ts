
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.resolve(__dirname, "../data");
const USERS_FILE = path.join(DB_DIR, "users.json");
const USERNAMES_FILE = path.join(DB_DIR, "usernames.json");

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const EMAIL = "Rebeccatheresa104@gmail.com";
const PASSWORD = "Rebecca104theresa";
const STUDENT_NUMBER = "THRRBC004";

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

async function seed() {
  console.log("🌱 Seeding Rebecca Theresa's student account...\n");

  // Create users.json and usernames.json if they don't exist
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2));
  }
  if (!fs.existsSync(USERNAMES_FILE)) {
    fs.writeFileSync(USERNAMES_FILE, JSON.stringify({}, null, 2));
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  const usernames = JSON.parse(fs.readFileSync(USERNAMES_FILE, "utf-8"));

  // Remove existing Rebecca if present
  const existingUid = usernames["thrrbc004"];
  if (existingUid && users[existingUid]) {
    delete users[existingUid];
    delete usernames["thrrbc004"];
    console.log("↺  Deleted existing user, re-creating...");
  }

  // Create new user
  const uid = "rebecca-student-001";
  const now = new Date().toISOString();

  users[uid] = {
    uid,
    email: EMAIL,
    firstName: "Rebecca",
    lastName: "Theresa",
    displayName: "Rebecca Theresa",
    preferredName: "Rebecca",
    username: "thrrbc004",
    studentNumber: STUDENT_NUMBER,
    photoURL: null,
    faculty: "Commerce",
    department: "School of Management Studies",
    program: "Bachelor of Business Administration & Tourism",
    yearOfStudy: 3,
    totalYears: 4,
    academicStanding: "Good Standing",
    gpa: 3.1,
    creditsCompleted: 192,
    lastLogin: "2026-04-05T08:42:00.000Z",
    createdAt: now,
    updatedAt: now,
    enrolledCourses: [
      { code: "BUS3014F", name: "Strategic Management", credits: 24, status: "Enrolled", currentMark: 74, progress: 74 },
      { code: "TRM3006S", name: "Tourism Destination Management", credits: 24, status: "Enrolled", currentMark: 69, progress: 69 },
      { code: "FIN3002F", name: "Corporate Finance", credits: 20, status: "Enrolled", currentMark: 71, progress: 71 },
      { code: "MKT3008S", name: "International Marketing", credits: 20, status: "Enrolled", currentMark: 78, progress: 78 },
      { code: "TRM3010F", name: "Hospitality & Events Management", credits: 16, status: "Enrolled", currentMark: 82, progress: 82 },
    ],
    residence: {
      name: "Tugwell Hall",
      room: "T203",
      mealPlan: "Partial (10 meals/week)",
      feeStatus: "Partially paid",
      houseCommitteeRole: "House Committee Treasurer",
    },
    passwordHash: simpleHash(PASSWORD),
  };

  usernames["thrrbc004"] = uid;

  // Save files
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  fs.writeFileSync(USERNAMES_FILE, JSON.stringify(usernames, null, 2));

  console.log(`✅ Auth user created: ${uid}`);
  console.log("✅ User profile saved");
  console.log("✅ Username reserved");
  console.log("\n📝 Test credentials:");
  console.log(`   Email:    ${EMAIL}`);
  console.log(`   Password: ${PASSWORD}`);
  console.log("   Username: thrrbc004\n");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
