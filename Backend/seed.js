import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import { User } from "./src/models/User.js";
import { Team } from "./src/models/Team.js";
import { TeamMember } from "./src/models/TeamMember.js";
import { Task } from "./src/models/Task.js";

const teamNames = [
  "Velocity Studio",
  "Design Labs",
  "Product Operations",
  "Analytics Suite",
  "Core Platform",
];

const mockPriorities = ["low", "medium", "high", "urgent"];
const mockStatuses = ["todo", "in_progress", "review", "done"];

const seed = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI is not defined in .env file.");
    process.exit(1);
  }

  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(mongoUri);
  console.log(`Connected successfully!`);

  // 1. Find or update Demo Leader to mega_leader
  console.log("Checking for Demo Leader...");
  let demoLeader = await User.findOne({
    $or: [
      { fullName: /Demo Leader/i },
      { email: /leader/i }
    ]
  });

  if (demoLeader) {
    console.log(`Found existing Demo Leader: ${demoLeader.fullName} (${demoLeader.email})`);
    demoLeader.platformRole = "mega_leader";
    await demoLeader.save();
    console.log(`Promoted Demo Leader to mega_leader platformRole!`);
  } else {
    console.log("Demo Leader not found. Creating a new Demo Leader user...");
    const passwordHash = await bcrypt.hash("password123", 12);
    demoLeader = await User.create({
      fullName: "Demo Leader",
      email: "leader@example.com",
      passwordHash,
      platformRole: "mega_leader",
    });
    console.log(`Created new Demo Leader with email: leader@example.com, password: password123`);
  }

  // Clear existing teams, team members, and tasks to start fresh
  console.log("Clearing existing teams, members, and tasks (keeping Users)...");
  await Team.deleteMany({});
  await TeamMember.deleteMany({});
  await Task.deleteMany({});

  // Ensure the Demo Leader is part of the system
  const passwordHash = await bcrypt.hash("password123", 12);

  for (let i = 0; i < teamNames.length; i++) {
    const teamName = teamNames[i];
    const inviteCode = `TEAM${i + 1}XX`;
    
    console.log(`\nCreating team: ${teamName}...`);
    
    // Create a Team Leader for this team
    const leaderName = `Leader ${teamName.split(" ")[0]}`;
    const leaderEmail = `leader.${teamName.split(" ")[0].toLowerCase()}@example.com`;
    
    let leaderUser = await User.findOne({ email: leaderEmail });
    if (!leaderUser) {
      leaderUser = await User.create({
        fullName: leaderName,
        email: leaderEmail,
        passwordHash,
        platformRole: "team_leader",
      });
      console.log(`Created leader user: ${leaderName}`);
    } else {
      leaderUser.platformRole = "team_leader";
      await leaderUser.save();
      console.log(`Found existing leader user: ${leaderName}`);
    }

    // Create the Team
    const team = await Team.create({
      teamName,
      inviteCode,
      leader: leaderUser._id,
      createdBy: demoLeader._id,
      description: `Premium workspace for the ${teamName} department, handling sprints, analytics, and operational tasks.`,
      memberCount: 6, // 1 leader + 5 members
    });

    // Add leader to TeamMember collection
    await TeamMember.create({
      team: team._id,
      user: leaderUser._id,
      role: "leader",
    });

    // Create 5 Team Members
    const members = [];
    for (let m = 1; m <= 5; m++) {
      const memberName = `Member ${m} of ${teamName.split(" ")[0]}`;
      const memberEmail = `member${m}.${teamName.split(" ")[0].toLowerCase()}@example.com`;
      
      let memberUser = await User.findOne({ email: memberEmail });
      if (!memberUser) {
        memberUser = await User.create({
          fullName: memberName,
          email: memberEmail,
          passwordHash,
          platformRole: "member",
        });
      }
      members.push(memberUser);

      await TeamMember.create({
        team: team._id,
        user: memberUser._id,
        role: "member",
      });
    }
    console.log(`Created and added 5 team members to ${teamName}.`);

    // Create tasks for this team
    console.log(`Generating mock tasks for ${teamName}...`);
    
    // A pool of users to assign tasks to (including leader and members)
    const taskAssignees = [leaderUser, ...members];
    
    // Create 8 tasks for this team with various priorities and statuses
    const taskTitles = [
      "Review sprint planning agenda",
      "Deploy hotfix for authentication error",
      "Draft UI layout for the settings panel",
      "Perform load testing on websocket connections",
      "Refactor helper functions in utils folder",
      "Audit security credentials for staging environment",
      "Update README instructions and documentation",
      "Prepare presentation for quarterly business review",
    ];

    for (let t = 0; t < taskTitles.length; t++) {
      const assignee = taskAssignees[t % taskAssignees.length];
      const status = mockStatuses[t % mockStatuses.length];
      const priority = mockPriorities[t % mockPriorities.length];
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (t - 2)); // varying due dates (some past, some future)

      await Task.create({
        team: team._id,
        title: taskTitles[t],
        description: `This is a sample description for the task "${taskTitles[t]}". Please ensure all criteria are met before marking as complete.`,
        status,
        priority,
        createdBy: leaderUser._id,
        assignedTo: assignee._id,
        dueDate,
      });
    }
  }

  // Also make sure the Demo Leader is added as a member to at least one team (e.g. Velocity Studio) so they can switch/view it as fallback
  const firstTeam = await Team.findOne({ teamName: "Velocity Studio" });
  if (firstTeam) {
    const existingMembership = await TeamMember.findOne({ team: firstTeam._id, user: demoLeader._id });
    if (!existingMembership) {
      await TeamMember.create({
        team: firstTeam._id,
        user: demoLeader._id,
        role: "member",
      });
      // Increment memberCount
      firstTeam.memberCount += 1;
      await firstTeam.save();
      console.log(`Added Demo Leader as a member of Velocity Studio so they have a team membership fallback.`);
    }
  }

  console.log("\nDatabase seeded successfully!");
  console.log(`Mega Leader account email: ${demoLeader.email}`);
  console.log("Team Leaders emails are of the format: leader.<teamname>@example.com (password: password123)");
  console.log("Team Members emails are of the format: member<1-5>.<teamname>@example.com (password: password123)");
  
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
