//dependencies required for the app
let express = require("express");
let bodyParser = require('body-parser'); //  to receive json data on backend 
let path = require('path');
let app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static('./public/'));
// view engine setup
app.set('view engine', 'html');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

let Task = {
    active: ["go to movie", "nodejs"],
    complete: ["finish shopping"],
    dueTime: 60, // in seconds
}

let TimeStamp = {} //dictionary to store timestamp of each element in active task

Task['active'].forEach((value) => {
    TimeStamp[value] = new Date();
});

// get all tasks
app.get('/task/all', function(req, res) {
    res.send(Task);
});

// change task due time
app.post('/task/time/update', function(req, res) {
    Task['dueTime'] = req.body.time;
    res.send(Task);
});

// add a tasks
app.post('/task/add', function(req, res) {

    if (!req.body.task) {
        throw Error('note field is required');
    } else {
        if(!Task['active'].includes(req.body.task)){
            Task['active'].push(req.body.task);
            TimeStamp[req.body.task] = new Date();
        }
    }

    res.send(Task);
});

// remove completed tasks
app.post('/task/remove', function(req, res) {
    let completedTask = req.body.completedTask;
    completedTask.forEach((value) => {
        Task['active'].splice(Task['active'].indexOf(value), 1);
        delete TimeStamp[value];
        Task['complete'].push(value);
    });

    res.send(Task);
});

app.get('/task/expired', function(req, res) {

    let currentDate = new Date();
    let expiredtasks = [];

    Task['active'].forEach((value) => {
        let taskDate = TimeStamp[value];
        let seconds = (currentDate.getTime() - taskDate.getTime()) / 1000;
        if(seconds > Task['dueTime']){
            expiredtasks.push(value);
        }
    })

    res.send(expiredtasks);
});

//set app to listen on port 3000
app.listen(3000, function() {
    console.log("server is running on port 3000");
});

module.exports = app;
