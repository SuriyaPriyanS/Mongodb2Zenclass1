db.topics.aggregate([
    {
        $match: {
            date: {
                $gte: new ISODate("2020-10-01T00:00:00Z"),
                $lte: new ISODate("2020-10-31T23:59:59Z")
            }
        }
    },
    {
        $lookup: {
            from: "tasks",
            localField: "topicId",
            foreignField: "topicId",
            as: "tasks"
        }
    }
])
db.company_drives.find({
    date: {
        $gte: new ISODate("2020-10-15T00:00:00Z"),
        $lte: new ISODate("2020-10-31T23:59:59Z")
    }
})
db.company_drives.aggregate([
    {
        $lookup: {
            from: "users",
            localField: "studentsAppeared",
            foreignField: "userId",
            as: "students"
        }
    }
])
db.codekata.aggregate([
    {
        $group: {
            _id: "$userId",
            totalProblemsSolved: { $sum: "$problemsSolved" }
        }
    }
])
db.mentors.find({
    $where: "this.mentees.length > 15"
})
db.attendance.aggregate([
    {
        $match: {
            date: {
                $gte: new ISODate("2020-10-15T00:00:00Z"),
                $lte: new ISODate("2020-10-31T23:59:59Z")
            },
            status: "Absent"
        }
    },
    {
        $lookup: {
            from: "tasks",
            let: { userId: "$userId", date: "$date" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$userId", "$$userId"] },
                                { $gte: ["$date", new ISODate("2020-10-15T00:00:00Z")] },
                                { $lte: ["$date", new ISODate("2020-10-31T23:59:59Z")] },
                                { $eq: ["$submitted", false] }
                            ]
                        }
                    }
                }
            ],
            as: "unsubmittedTasks"
        }
    },
    {
        $match: {
            "unsubmittedTasks.0": { $exists: true }
        }
    },
    {
        $count: "totalAbsentAndUnsubmitted"
    }
])

