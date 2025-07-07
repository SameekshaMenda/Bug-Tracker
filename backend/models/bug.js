const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: "Open"},
    priority:{type: String, enum: ['Low', 'Medium', 'High'], default: "Medium"},
    reporter: String,
    assignedTo: String,
    createdAt: {type: Date, default: Date.now}

});

module.exports = mongoose.model('Bug', bugSchema);