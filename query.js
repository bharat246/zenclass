// Query 1: Topics in October
db.topics.find({
  date: { $gte: ISODate("2020-10-01"), $lte: ISODate("2020-10-31") }
});

// Query 1: Tasks in October
db.tasks.find({
  date: { $gte: ISODate("2020-10-01"), $lte: ISODate("2020-10-31") }
});

// Query 2: Company drives between 15 Oct - 31 Oct
db.company_drives.find({
  drive_date: { $gte: ISODate("2020-10-15"), $lte: ISODate("2020-10-31") }
});

// Query 3: Company drives + students attended
db.company_drives.aggregate([
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
]);

// Query 4: Problems solved by each user in codekata
db.codekata.aggregate([
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
      user_name: "$userDetails.name",
      problems_solved: 1
    }
  }
]);

// Query 5: Mentors with mentee_count > 15
db.mentors.find({ mentee_count: { $gt: 15 } });

// Query 6: Users absent and task not submitted between 15 Oct - 31 Oct
db.attendance.aggregate([
  {
    $match: {
      date: { $gte: ISODate("2020-10-15"), $lte: ISODate("2020-10-31") },
      status: "absent"
    }
  },
  {
    $lookup: {
      from: "task_submissions",
      localField: "user_id",
      foreignField: "user_id",
      as: "taskData"
    }
  },
  { $unwind: "$taskData" },
  { $match: { "taskData.submitted": false } },
  { $group: { _id: "$user_id" } },
  { $count: "absent_and_not_submitted_users" }
]);