// ***********************************
// DEPENDENCIES
// ***********************************

// import express
require("dotenv").config() // this is how we make use of our .env variables
require("./config/db") // bring in our db config
const express = require("express")
// import morgan
const morgan = require("morgan")
const animals = require("./models/animals")
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
       animals,

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
    res.render("index.ejs", {animals})
})

// NEW
app.get('/animals/new', (req, res) => {
    res.render('new.ejs', {animals})
});

// DESTROY
app.delete("/animals/:id", (req, res) => {
    Pokemon.splice(req.params.id, 1);
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
    animals[req.params.id] = updateAnimals;
    res.redirect(`/animals/${req.params.id}`);
  });


// ********************************
// SERVER LISTENER
// ********************************

app.listen(PORT, () => console.log(`Listening to the sounds of ${PORT}`))