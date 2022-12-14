// modules needed
const express = require("express");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();

const noteData = require('./db/db.json');




// middleware to be used
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// all of the get routes needed to get the info from the stored notes
app.get("/api/notes", (req, res) => {
    res.json(noteData.slice(1));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

// function that creates the new notes with the input from the user
function createNewNotes(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];

    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
};

// posting the new notes onto the page
app.post("/api/notes", (req, res) => {
    const newNote = createNewNotes(req.body, noteData)
    res.json(newNote);
});



// the function we need to delete the notes from the database
function deleteNotes(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, i);
            fs.writeFileSync(
                path.join(__dirname, "./db/db.json"),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

// the delete path for deleting the notes 
app.delete("/api/notes/:id", (req, res) => {
    deleteNotes(req.params.id, noteData);
    res.json(true);
})

// for the local port we are using to host the server
app.listen(PORT, () => {
    console.log(`listening to http://localhost:${PORT}`)

})