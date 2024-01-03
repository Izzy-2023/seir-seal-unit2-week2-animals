// ****************************
// DEPENDENCIES
// ****************************
require("dotenv").config() // load .env variables
const express = require("express") // our web framework
const morgan = require("morgan") // our logger
const methodOverride = require("method-override") // override forms
const mongoose = require("mongoose") // connect to our mongodb

// *****************************
// DATABASE CONNECTION
// *****************************
// our database connection string
const DATABASE_URL = process.env.DATABASE_URL

// *****************************
// Establish our connection
// *****************************
mongoose.connect(DATABASE_URL)

// *****************************
// Events for when connection opens/disconnects/errors
// *****************************
mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("close", () => console.log("Disconnected from Mongoose"))
.on("error", (error) => console.log(error))

//********************************************** 
// Our Models
//********************************************** 
// pull schema and model from mongoose
const {Schema, model} = mongoose

// make animals schema
const animalsSchema = new mongoose.Schema({
  species: String, 
  extinct: Boolean,
  location: String,
  lifeExpectancy: Number,
})

// make animals model
const Animal = model("Animals", animalsSchema)

//***********************************************
// Create our Express Application Object
//*********************************************** 
const app = express()

//*********************************
// Middleware
//********************************* 
app.use(morgan("dev")) //logging
app.use(methodOverride("_method")) // override for put and delete requests from forms
app.use(express.urlencoded({extended: true})) // parse urlencoded request bodies
app.use(express.static("public")) // serve files from public statically


// ********************************
// ROUTES
// ********************************

app.get("/", (req, res) => {
  res.send("your server is running... better catch it.")
})

app.get("/animals/seed", async (req, res) => {

  try{
      // array of starter animals
      const startAnimals = [
        { species: "Tiger", extinct: false, location: "Various regions in Asia", lifeExpectancy: 20},
        { species: "Dodo", extinct: true, location: "Mauritius", lifeExpectancy: 20},
        { species: "Giant Panda", extinct: false, location: "China", lifeExpectancy: 20},
        { species: "Blue Whale", extinct: false, location: "Oceans worldwide", lifeExpectancy: 70},
        { species: "Tiger", extinct: false, location: "Various regions in Asia", lifeExpectancy: 20},

        ]

     // Delete all animals
     await Animal.deleteMany({})
  
     // Seed Starter Animals
     const animals = await Animal.create(startAnimals)
  
     // send created animals as response to confirm creation
     res.json(animals);
  } catch(error) {
    console.log(error.message)
    res.status(400).send(error.message)
  }
});

  // Index Route Get -> /animals
  app.get("/animals", async (req, res) => {
    try {
      const animals = await Animal.find({});
      // render a template
      res.render("index.ejs", {animals});
    } catch (error) {
        console.log("---------", error.message, "----------")
      res.status(400).send(error.message);
    }
  });


// NEW
app.get('/animals/new', (req, res) => {
    res.render('new.ejs', {Animal})
});


// create route
app.post("/animals", async (req, res) => {
  try {
    // check if the readyToEat property should be true or false
    req.body.extinct = req.body.exrinct === "on" ? true : false;
    // create the new fruit
    await Animal.create(req.body);
    // redirect the user back to the main fruits page after fruit created
    res.redirect("/animals");
  } catch (error) {
    console.log("-----", error.message, "------")
    res.status(400).send(error.message);
  }
});
  // EDIT 
  app.get("/animals/:id/edit", (req, res) => {
    res.render("edit.ejs", {
      aAnimal: Animal[req.params.id],
      index: req.params.id
    });
  });

// Edit Route (Get to /animals/:id/edit)
app.get("/animals/:id/edit", async (req, res) => {
  try {
    // get the id from params
    const id = req.params.id;
    // get the fruit from the db
    const animals = await Animal.findById(id);
    //render the template
    res.render("edit.ejs", {animals});
  } catch (error) {
    console.log("-----", error.message, "------");
    res.status(400).send("error, read logs for details");
  }
});

//update route
app.put("/animals/:id", async (req, res) => {
  try {
    // get the id from params
    const id = req.params.id;
    // check if the extinct property should be true or false
    req.body.extinct = req.body.extinct === "on" ? true : false;
    // update the animal
    await Animal.findByIdAndUpdate(id, req.body, { new: true });
    // redirect user back to main page when fruit
    res.redirect(`/animals/${id}`);
  } catch (error) {
    console.log("-----", error.message, "------");
    res.status(400).send(error.message);
  }
});

// DESTROY
app.delete("/animals/:id", (req, res) => {
    Animal.splice(req.params.id, 1);
    res.redirect("/animals");
  });

  // The Delete Route (delete to /animals/:id)
app.delete("/animals/:id", async (req, res) => {
  // get the id
  const id = req.params.id
  // delete the animal
  await Animal.findByIdAndDelete(id)
  // redirect to main page
  res.redirect("/animals")
})

// SHOW
app.get("/animals/:id", (req, res) => {
    res.render("show.ejs", {
      index: req.params.id,
      aAnimal: Animal[req.params.id]
    });
  });

  // The Show Route (Get to /animals/:id)
app.get("/animals/:id", async (req, res) => {
  try{
      // get the id from params
      const id = req.params.id

      // find the particular fruit from the database
      const animals = await Animal.findById(id)

      // render the template with the fruit
      res.render("show.ejs", {fruit})
  }catch(error){
      console.log("-----", error.message, "------")
      res.status(400).send("error, read logs for details")
  }
})


// ********************************
// SERVER LISTENER
// ********************************
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`))
