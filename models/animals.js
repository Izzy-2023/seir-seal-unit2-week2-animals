// ****************************
// DEPENDENCIES
// ****************************

const mongoose = require("mongoose")

// make animals schema
const animalsSchema = new mongoose.Schema({
    species: {type: String, required: true},
    extinct: {type: Boolean, required: true},
    location: {type: Boolean, required: true},
    lifeExpectancy: {type: Number, required: true}
})

// make animals model
const animals = mongoose.model("animals", animalsSchema)

// we export the animals
module.exports = animals