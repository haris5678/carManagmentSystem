const { default: mongoose } = require("mongoose");

const getPipeline = (userId) => [
  {
    $match: {
      createdBy: new mongoose.Types.ObjectId(userId),
    },
  },
  {
    $group: {
      _id: "$category",
      total: { $sum: 1 },
    },
  },
  {
    $lookup: {
      from: "categories",
      let: { category_id: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$category_id"],
            },
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
          },
        },
      ],
      as: "categoryDetails",
    },
  },
  {
    $unwind: {
      path: "$categoryDetails",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      _id: 0,
      category: "$categoryDetails.name",
      total: 1,
    },
  },
];

module.exports = getPipeline;
