// ****************************
// DEPENDENCIES
// ****************************

const mongoose = require("mongoose")

// make animals schema
const animalsSchema = new mongoose.Schema({
    species: {type: String, required: true},
    extinct: Boolean,
    location: {type: String, required: true},
    lifeExpectancy: {type: Number, required: true}
})

// make animals model
const Animals = mongoose.model("Animals", animalsSchema)

// we export the animals
module.exports = Animals;