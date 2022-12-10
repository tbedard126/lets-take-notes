const express = require("express");
const fs = require("fs");
const util = require("util");
const path = require("path"); 
const exp = require("constants");
const PORT = process.env.PORT || 3001;
const app = express();
const uniqid = require('uniqid');
const noteData = require('./db/db.json')
 



app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", (req, res) => {
    res.json(noteData);
    console.log(noteData);
})


app.post("/api/notes", (req, res) => {
    console.log("the post route");
    const newNote = req.body;
    newNote.id = uniqid();
    noteData.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(noteData, null, 4),  (err) =>  {
        err ? console.log(err) : res.send(newNote);
    })
})