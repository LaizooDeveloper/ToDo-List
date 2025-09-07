const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

let tasks = [];

// Home page
app.get("/", (req, res) => {
    let completed = tasks.filter(t => t.done).length;
    let progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
    res.render("index", { tasks, progress });
});

// Add task
app.post("/add", (req, res) => {
    const { task, category, deadline, priority } = req.body;
    tasks.push({ id: Date.now(), text: task, category, deadline, priority, done: false });
    res.redirect("/");
});

// Toggle done
app.post("/toggle/:id", (req, res) => {
    const task = tasks.find(t => t.id == req.params.id);
    if (task) task.done = !task.done;
    res.redirect("/");
});

// Delete task
app.post("/delete/:id", (req, res) => {
    tasks = tasks.filter(t => t.id != req.params.id);
    res.redirect("/");
});

// Edit task
app.post("/edit/:id", (req, res) => {
    const task = tasks.find(t => t.id == req.params.id);
    if (task) {
        const { newText, newCategory, newDeadline, newPriority } = req.body;
        task.text = newText;
        task.category = newCategory;
        task.deadline = newDeadline;
        task.priority = newPriority;
    }
    res.redirect("/");
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
