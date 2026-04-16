const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const dbName = "zen_class_db";

async function insertData() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Connected Successfully");

    const db = client.db(dbName);

    // Collections
    const users = db.collection("users");
    const mentors = db.collection("mentors");
    const topics = db.collection("topics");
    const tasks = db.collection("tasks");
    const attendance = db.collection("attendance");
    const codekata = db.collection("codekata");
    const company_drives = db.collection("company_drives");
    const task_submissions = db.collection("task_submissions");

    // Clear old data
    await users.deleteMany({});
    await mentors.deleteMany({});
    await topics.deleteMany({});
    await tasks.deleteMany({});
    await attendance.deleteMany({});
    await codekata.deleteMany({});
    await company_drives.deleteMany({});
    await task_submissions.deleteMany({});

    console.log("🗑️ Old Data Cleared");

    // Insert Mentors
    const mentorData = await mentors.insertMany([
      { name: "Rahul Sir", expertise: "MongoDB", mentee_count: 18 },
      { name: "Amit Sir", expertise: "React", mentee_count: 12 },
      { name: "Priya Mam", expertise: "NodeJS", mentee_count: 20 }
    ]);

    const mentorIds = Object.values(mentorData.insertedIds);

    // Insert Users
    const userData = await users.insertMany([
      { name: "Bharat", email: "bharat@gmail.com", batch: "B45", mentor_id: mentorIds[0] },
      { name: "Rohit", email: "rohit@gmail.com", batch: "B45", mentor_id: mentorIds[0] },
      { name: "Neha", email: "neha@gmail.com", batch: "B46", mentor_id: mentorIds[1] },
      { name: "Simran", email: "simran@gmail.com", batch: "B46", mentor_id: mentorIds[2] },
      { name: "Aman", email: "aman@gmail.com", batch: "B47", mentor_id: mentorIds[2] }
    ]);

    const userIds = Object.values(userData.insertedIds);

    // Insert Topics
    const topicData = await topics.insertMany([
      { topic_name: "JavaScript Basics", date: new Date("2020-09-20") },
      { topic_name: "MongoDB CRUD", date: new Date("2020-10-05") },
      { topic_name: "MongoDB Aggregation", date: new Date("2020-10-15") },
      { topic_name: "NodeJS Intro", date: new Date("2020-11-02") }
    ]);

    const topicIds = Object.values(topicData.insertedIds);

    // Insert Tasks
    const taskData = await tasks.insertMany([
      { task_name: "JS Task", topic_id: topicIds[0], date: new Date("2020-09-25") },
      { task_name: "MongoDB CRUD Task", topic_id: topicIds[1], date: new Date("2020-10-10") },
      { task_name: "MongoDB Aggregation Task", topic_id: topicIds[2], date: new Date("2020-10-20") },
      { task_name: "NodeJS Task", topic_id: topicIds[3], date: new Date("2020-11-05") }
    ]);

    const taskIds = Object.values(taskData.insertedIds);

    // Insert Attendance
    await attendance.insertMany([
      { user_id: userIds[0], date: new Date("2020-10-16"), status: "present" },
      { user_id: userIds[1], date: new Date("2020-10-18"), status: "absent" },
      { user_id: userIds[2], date: new Date("2020-10-20"), status: "absent" },
      { user_id: userIds[3], date: new Date("2020-10-25"), status: "present" },
      { user_id: userIds[4], date: new Date("2020-10-28"), status: "absent" }
    ]);

    // Insert Codekata
    await codekata.insertMany([
      { user_id: userIds[0], problems_solved: 120 },
      { user_id: userIds[1], problems_solved: 80 },
      { user_id: userIds[2], problems_solved: 50 },
      { user_id: userIds[3], problems_solved: 95 },
      { user_id: userIds[4], problems_solved: 60 }
    ]);

    // Insert Company Drives
    await company_drives.insertMany([
      {
        company_name: "TCS",
        drive_date: new Date("2020-10-20"),
        students_attended: [userIds[0], userIds[1], userIds[2]]
      },
      {
        company_name: "Infosys",
        drive_date: new Date("2020-10-28"),
        students_attended: [userIds[3], userIds[4]]
      },
      {
        company_name: "Wipro",
        drive_date: new Date("2020-11-05"),
        students_attended: [userIds[0], userIds[4]]
      }
    ]);

    // Insert Task Submissions
    await task_submissions.insertMany([
      { user_id: userIds[0], task_id: taskIds[1], submitted: true, submitted_date: new Date("2020-10-11") },
      { user_id: userIds[1], task_id: taskIds[1], submitted: false, submitted_date: null },
      { user_id: userIds[2], task_id: taskIds[2], submitted: false, submitted_date: null },
      { user_id: userIds[3], task_id: taskIds[2], submitted: true, submitted_date: new Date("2020-10-22") },
      { user_id: userIds[4], task_id: taskIds[2], submitted: false, submitted_date: null }
    ]);

    console.log("✅ All Data Inserted Successfully!");
  } catch (error) {
    console.log("❌ Error:", error);
  } finally {
    await client.close();
    console.log("🔒 Connection Closed");
  }
}

insertData();