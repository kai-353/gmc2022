const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  groupNumber: {
    type: Number,
    required: true,
  },
  members: {
    type: Array,
    default: [],
  },
  completedAssignments: {
    type: Array,
    default: [{ title: "start", id: "" }],
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
    id: xxx,
    wrong_tries: 0,
  },
  {
    id: xxx,
    wrong_tries: 3,
  }
]

berekenen:
(maxpoints / (5 - wrong_tries))

*/

const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;
