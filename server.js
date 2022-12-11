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


app.post("/api/notes", (req, res) => {
    const newNote = createNewNotes(req.body, noteData)
    res.json(newNote);
});




function deleteNotes(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, i);
            fs.writeFileSync(
                path.join(__dirname, "./db/db.json").
                    JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

app.delete("/api/notes/:id", (req, res) => {
    deleteNotes(req.params.id, noteData);
    res.json(true);
})


app.listen(PORT, () => {
    console.log(`listening to http://localHost:${PORT}`)

})