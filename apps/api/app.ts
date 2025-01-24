import { addOrUpdateHabit, deleteHabitById } from "./dynamo.config";

const express = require("express");
const { getHabits, getHabitById } = require("./dynamo.config");
const app = express();

app.use(express.json());

//TODO: Add types for Request and Response from express?
app.get("/", (req: any, res: any) => {
  res.send(JSON.stringify({ message: "Hello World" }));
});

app.get("/habits", async (req: any, res: any) => {
  try {
    const habits = await getHabits();
    res.send(JSON.stringify(habits.Items));
  } catch (error: any) {
    res.status(500).send(JSON.stringify({ error: error.message }));
  }
});

app.get("/habits/:id", async (req: any, res: any) => {
  const id = req.params.id;
  try {
    const habits = await getHabitById(id);
    res.send(JSON.stringify(habits.Item));
  } catch (error: any) {
    res.status(500).send(JSON.stringify({ error: error.message }));
  }
});

app.post("/habits", async (req: any, res: any) => {
  const habit = req.body;
  try {
    const newHabit = await addOrUpdateHabit(habit);
    res.send(newHabit);
  } catch (error: any) {
    console.log(error);
    res.status(500).send(JSON.stringify({ error: error.message }));
  }
});

app.put("/habits/:id", async (req: any, res: any) => {
  const habit = req.body;
  const { id } = req.params;
  habit.habitsId = id;
  try {
    const updatedHabit = await addOrUpdateHabit(habit);
    res.send(updatedHabit);
  } catch (error: any) {
    res.status(500).send(JSON.stringify({ error: error.message }));
  }
});

app.delete("/habits/:id", async (req: any, res: any) => {
  const { id } = req.params;
  try {
    res.json(await deleteHabitById(id));
  } catch (error: any) {
    res.status(500).send(JSON.stringify({ error: error.message }));
  }
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`🟢 API is running @ http://localhost:${port}/`);
});
