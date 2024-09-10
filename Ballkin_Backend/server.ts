import express from "express";

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("laterbitches");
})

app.listen(PORT, () => {{
    console.log("Server running on Port:", PORT);
}})