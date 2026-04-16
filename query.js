const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const dbName = "zen_class_db";

async function runQueries() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Connected Successfully");

    const db = client.db(dbName);

    // 1. Find all topics and tasks taught in October
    console.log("\n📌 1) Topics taught in October:");
    const octoberTopics = await db.collection("topics").find({
      date: {
        $gte: new Date("2020-10-01"),
        $lte: new Date("2020-10-31")
      }
    }).toArray();
    console.log(octoberTopics);

    console.log("\n📌 Tasks taught in October:");
    const octoberTasks = await db.collection("tasks").find({
      date: {
        $gte: new Date("2020-10-01"),
        $lte: new Date("2020-10-31")
      }
    }).toArray();
    console.log(octoberTasks);

    // 2. Company drives between 15 Oct - 31 Oct
    console.log("\n📌 2) Company drives between 15 Oct - 31 Oct:");
    const drives = await db.collection("company_drives").find({
      drive_date: {
        $gte: new Date("2020-10-15"),
        $lte: new Date("2020-10-31")
      }
    }).toArray();
    console.log(drives);

    // 3. Company drives and students who appeared
    console.log("\n📌 3) Company drives with students attended:");
    const drivesWithStudents = await db.collection("company_drives").aggregate([
      {
        $lookup: {
          from: "users",
          localField: "students_attended",
          foreignField: "_id",
          as: "students"
        }
      },
      {
        $project: {
          _id: 0,
          company_name: 1,
          drive_date: 1,
          "students.name": 1,
          "students.email": 1
        }
      }
    ]).toArray();
    console.log(drivesWithStudents);

    // 4. Number of problems solved by user in codekata
    console.log("\n📌 4) Problems solved by each user:");
    const codekataSolved = await db.collection("codekata").aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          user: "$userDetails.name",
          problems_solved: 1
        }
      }
    ]).toArray();
    console.log(codekataSolved);

    // 5. Mentors with mentee count > 15
    console.log("\n📌 5) Mentors with mentee_count > 15:");
    const mentorsMoreThan15 = await db.collection("mentors").find({
      mentee_count: { $gt: 15 }
    }).toArray();
    console.log(mentorsMoreThan15);

    // 6. Users absent and task not submitted between 15 Oct - 31 Oct
    console.log("\n📌 6) Users absent and task not submitted (15 Oct - 31 Oct):");
    const absentAndNotSubmitted = await db.collection("attendance").aggregate([
      {
        $match: {
          date: {
            $gte: new Date("2020-10-15"),
            $lte: new Date("2020-10-31")
          },
          status: "absent"
        }
      },
      {
        $lookup: {
          from: "task_submissions",
          localField: "user_id",
          foreignField: "user_id",
          as: "taskStatus"
        }
      },
      { $unwind: "$taskStatus" },
      {
        $match: {
          "taskStatus.submitted": false
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          user: "$userDetails.name",
          email: "$userDetails.email",
          attendance_date: "$date",
          status: 1,
          submitted: "$taskStatus.submitted"
        }
      }
    ]).toArray();
    console.log(absentAndNotSubmitted);

  } catch (error) {
    console.log("❌ Error:", error);
  } finally {
    await client.close();
    console.log("\n🔒 Connection Closed");
  }
}

runQueries();