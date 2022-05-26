const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  groupNumber: {
    type: "String",
    required: true,
  },
  members: {
    type: Array,
    default: [],
  },
  completedAssignments: {
    type: Array,
    default: ["start"],
  },
  tries: {
    type: Array,
    default: [],
  },
});

/*
tries:

[
  {
    title: A1,
    wrong_tries: 0,
  },
  {
    title: A2,
    wrong_tries: 3,
  }
]

berekenen:
(maxpoints / (5 - wrong_tries))

*/

const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;
