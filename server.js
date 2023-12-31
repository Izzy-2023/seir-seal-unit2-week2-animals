// ***********************************
// DEPENDENCIES
// ***********************************

// import express
require("dotenv").config() // this is how we make use of our .env variables
require("./config/db") // bring in our db config
const express = require("express")
// import morgan
const morgan = require("morgan")
const Animals = require("./models/animals")
// import method override
const methodOverride = require("method-override")
const { PORT = 3013 } = process.env;

// create our app object
const app = express()

// **********************************
// MIDDLEWARE
// **********************************

app.use((req, res, next) => {
    req.model = {
       Animals,

    }
        console.log("this is middleware")
        // go to the next app method
        next()
    })

app.use(express.static("public")) // use a "public" folder for files
// public/style.css -> /style.css
// public/app.js -> /app.js
// express.urlencoded (prase url encoded bodies)
// add the data to req.body
app.use(express.urlencoded({extended: true}))
// morgan - log data about each request for debugging
app.use(morgan("dev"))
// methodOverride - allows to override form post requests
// as a different method like PUT or DELETE
// It will look for a _method url query
app.use(methodOverride("_method"))

// ********************************
// ROUTES
// ********************************

// INDEX
app.get("/animals", (req, res) => {
    res.render("index.ejs", {Animals})
})

// NEW
app.get('/animals/new', (req, res) => {
    res.render('new.ejs', {Animals})
});

// DESTROY
app.delete("/animals/:id", (req, res) => {
    Animals.splice(req.params.id, 1);
    res.redirect("/animals");
  });

  // UPDATE 
app.put("/animals/:id", (req, res) => {
    const updateAnimals = {
      species: req.body.species,
      extinct: req.body.extinct,
      location: req.body.location,
      lifeExpectancy: req.body.lifeExpectancy
      }
    Animals[req.params.id] = updateAnimals;
    res.redirect(`/animals/${req.params.id}`);
  });

  // EDIT 
app.get("/animals/:id/edit", (req, res) => {
    res.render("edit.ejs", {
      aAnimal: Animals[req.params.id],
      index: req.params.id
    });
  });

  // CREATE
app.post("/animals", (req, res) => {
    const newAnimal = {
        species: req.body.species,
        extinct: req.body.extinct,
        location: req.body.location,
        lifeExpectancy: req.body.lifeExpectancy
      }
    Animals.push(newAnimal);
    res.send(newAnimal);
  });

// SHOW
app.get("/animals/:id", (req, res) => {
    res.render("show.ejs", {
      index: req.params.id,
      aAnimal: Animals[req.params.id]
    });
  });


// ********************************
// SERVER LISTENER
// ********************************

app.listen(PORT, () => console.log(`Listening to the sounds of ${PORT}`))