import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.resolve(__dirname, "../../data");
const USERS_FILE = path.join(DB_DIR, "users.json");
const USERNAMES_FILE = path.join(DB_DIR, "usernames.json");

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Ensure files exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2));
}

if (!fs.existsSync(USERNAMES_FILE)) {
  fs.writeFileSync(USERNAMES_FILE, JSON.stringify({}, null, 2));
}

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  username: string;
  studentNumber: string | null;
  preferredName: string | null;
  photoURL: string | null;
  faculty: string | null;
  program: string | null;
  yearOfStudy: number | null;
  totalYears: number | null;
  academicStanding: string | null;
  department: string | null;
  gpa: number | null;
  creditsCompleted: number;
  enrolledCourses: Course[];
  residence: ResidenceInfo | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  code: string;
  name: string;
  credits: number;
  status: string;
  currentMark: number | null;
  progress: number;
}

export interface ResidenceInfo {
  name: string;
  room: string;
  mealPlan: string;
  feeStatus: string;
  houseCommitteeRole: string | null;
}

interface StoredUser extends UserProfile {
  passwordHash: string; // Simple hash for demo (not cryptographically secure)
}

function readUsers(): Record<string, StoredUser> {
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

function writeUsers(users: Record<string, StoredUser>): void {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function readUsernames(): Record<string, string> {
  const data = fs.readFileSync(USERNAMES_FILE, "utf-8");
  return JSON.parse(data);
}

function writeUsernames(usernames: Record<string, string>): void {
  fs.writeFileSync(USERNAMES_FILE, JSON.stringify(usernames, null, 2));
}

// Simple hash function (for demo - not production-grade)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export const db = {
  // Auth methods
  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
  }): Promise<string> {
    const users = readUsers();
    const usernames = readUsernames();

    // Check if email exists
    const emailExists = Object.values(users).some((u) => u.email === data.email);
    if (emailExists) {
      throw new Error("Email already exists");
    }

    // Check if username exists
    if (usernames[data.username.toLowerCase()]) {
      throw new Error("Username already taken");
    }

    const uid = randomUUID();
    const now = new Date().toISOString();

    const newUser: StoredUser = {
      uid,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      displayName: `${data.firstName} ${data.lastName}`,
      passwordHash: simpleHash(data.password),
      studentNumber: null,
      preferredName: null,
      photoURL: null,
      faculty: null,
      program: null,
      yearOfStudy: null,
      totalYears: null,
      academicStanding: null,
      department: null,
      gpa: null,
      creditsCompleted: 0,
      enrolledCourses: [],
      residence: null,
      lastLogin: null,
      createdAt: now,
      updatedAt: now,
    };

    users[uid] = newUser;
    usernames[data.username.toLowerCase()] = uid;

    writeUsers(users);
    writeUsernames(usernames);

    return uid;
  },

  async verifyCredentials(email: string, password: string): Promise<string | null> {
    const users = readUsers();
    const user = Object.values(users).find((u) => u.email === email);

    if (!user) {
      return null;
    }

    const passwordHash = simpleHash(password);
    if (user.passwordHash !== passwordHash) {
      return null;
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    writeUsers(users);

    return user.uid;
  },

  async getUserById(uid: string): Promise<StoredUser | null> {
    const users = readUsers();
    return users[uid] || null;
  },

  async getUserByEmail(email: string): Promise<StoredUser | null> {
    const users = readUsers();
    return Object.values(users).find((u) => u.email === email) || null;
  },

  async updateUser(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const users = readUsers();
    const user = users[uid];

    if (!user) {
      throw new Error("User not found");
    }

    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    writeUsers(users);
  },

  async deleteUser(uid: string): Promise<void> {
    const users = readUsers();
    const usernames = readUsernames();
    const user = users[uid];

    if (!user) {
      throw new Error("User not found");
    }

    // Remove username mapping
    if (user.username) {
      delete usernames[user.username.toLowerCase()];
    }

    delete users[uid];
    writeUsers(users);
    writeUsernames(usernames);
  },

  async checkUsernameAvailable(username: string): Promise<boolean> {
    const usernames = readUsernames();
    return !usernames[username.toLowerCase()];
  },

  // Helper to remove password hash before sending to client
  sanitizeUser(user: StoredUser): UserProfile {
    const { passwordHash, ...sanitized } = user;
    return sanitized as UserProfile;
  },
};
