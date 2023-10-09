import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";

const app = express();
//const PORT = 3000;
const PORT = process.env.PORT || 3030;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));
app.use(express.static("Assets"));

//establishing connection to the mongodb database using mongoose
 mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  }) ;
 
  //creating schema for daily tasks
  const tasksSchema = new mongoose.Schema(
    {
      Taskname: String
    }
);
//creating a model based on the schema created above means we are making a collection that will follow the schema structure
const Tasks = mongoose.model("Task", tasksSchema);
//create three default items
const Task1 = new Tasks({
  Taskname: "Grocery"
  });
const Task2 = new Tasks({
  Taskname: "Cleaning"
  });
const Task3 = new Tasks({
  Taskname: "Cooking"
  });
const taskArray = [Task1, Task2, Task3];

const WorkTasks = mongoose.model("WorkTask", tasksSchema);
const WTask1 = new WorkTasks({
  Taskname: "Meeting"
  });
const WTask2 = new WorkTasks({
  Taskname: "Writing Emails"
  });

  const WorktaskArray = [WTask1, WTask2];
  
async function Insertdata() 
{
      
Tasks.insertMany(taskArray).then(function(){
  console.log("Data inserted")  // Success
}).catch(function(error){
  console.log(error)      // Failure
});  
}
async function Insertworkdata() 
{
      
 WorkTasks.insertMany(WorktaskArray).then(function(){
  console.log("Work Data inserted")  // Success
}).catch(function(error){
  console.log(error)      // Failure
}); 
}
app.listen(PORT, ()=>{
    console.log(`server is listening at ${PORT}`);
});


app.get("/", (req, res) =>{
res.render(__dirname + "/views/index.ejs");
});

app.get("/dailyTasks.ejs", (req, res) => {
  Tasks.find({})
    .then(foundTasks => {
 
      if (foundTasks.length === 0) {
        Insertdata().then(function () {
          console.log("Successfully saved default items to DB");
        })
        .catch(function (err) {
          console.log(err);
        });
        res.redirect("/dailyTasks.ejs");
      } else {
        res.render("dailyTasks.ejs", {IV: foundTasks});
      }
 
    })
    .catch(err => {
      console.error(err);
    });
    
   });

   app.get("/Worktasks.ejs", (req, res) => {
    WorkTasks.find({})
    .then(foundworkTasks => {
 
      if (foundworkTasks.length === 0) {
        Insertworkdata().then(function () {
          console.log("Successfully saved default items to DB");
        })
        .catch(function (err) {
          console.log(err);
        });
        res.redirect("/Worktasks.ejs");
      } else {
        res.render("Worktasks.ejs", {WIV: foundworkTasks});
      }
 
    })
    .catch(err => {
      console.error(err);
    });
   });

   app.post("/dailyTasks.ejs", (req,res) =>{
     const task = req.body.newItem;
    const newtask = new Tasks({
      Taskname: task
    }); 
      newtask.save();
      res.redirect("/dailyTasks.ejs");
   });
  
   app.post("/Worktasks.ejs", (req,res) =>{
   const worktask = req.body.worknewItem;
   const newworktask = new WorkTasks({
    Taskname: worktask
  }); 
  newworktask.save();
    res.redirect("/Worktasks.ejs");
  });
 
  app.post("/deleteworktask", async (req, res) => {
    const checkedItemId = req.body.checkbox;  
      await WorkTasks.findByIdAndRemove(checkedItemId)
      .then(function () {
        console.log("successfully deleted checked item");
      })
      .catch(function (err) {
        console.log(err);
      });
  
    res.redirect("/Worktasks.ejs"); 
  });

  app.post("/deletedailytask", async (req, res) => {
    const checkedItemId = req.body.checkbox;  
      await Tasks.findByIdAndRemove(checkedItemId)
      .then(function () {
        console.log("successfully deleted checked item");
      })
      .catch(function (err) {
        console.log(err);
      });
  
    res.redirect("/dailyTasks.ejs"); 
  });
  
  
  app.get("/index.ejs", (req, res) =>{
    res.render(__dirname + "/views/index.ejs");
    });
 
   





