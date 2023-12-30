
const {Schema, model} = mongoose

// make fruits schema
const animalsSchema = new Schema({
    species: String,
    extinct: Boolean,
    location: Boolean,
    lifeExpectancy: Number
})

// make fruit model
const Animals = model("Animals", animalsSchema)

// we export the fruits
module.exports = Animals