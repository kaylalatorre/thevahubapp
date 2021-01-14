/* DEPENDENCIES */
const express = require('express');
const hbs = require('handlebars');
const exphbs = require('express-handlebars');
const bodyParser = require ('body-parser');
const cookieParser = require('cookie-parser'); //generates cookies to keep track of logged-in user
const session = require('express-session'); //keeps track of who's logged in
const mongoose = require('mongoose');
const path = require('path');
const FilePond = require('filepond'); //for uploading files

/* EXPRESS APPLICATION */
const app = express();
const port = process.env.port || 9000;
 
/* CONNECT DB */ 
 const db = require('./models/db');
 db.connect();
 
/* INITIALIZING DOTENV (for db access info)*/
require('dotenv').config();

/* INITIALIZING COOKIES & SESSION, BODYPARSER */
 app.use(cookieParser());

 app.use(session({
 	secret: 'tvhsecret',
 	name: 'tvhsession',
 	resave: true,
 	saveUninitialized: true
 }));

/* BODY PARSER */
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(bodyParser.json());

/* FILEPOND */
// Create a multi file upload component
const pond = FilePond.create({
    multiple: true,
    name: 'filepond'
});


/* CREATE HBS ENGINE */
app.engine('hbs', exphbs({  
  extname: 'hbs',
  defaultView: 'main',
layoutsDir: path.join(__dirname, '/views/layouts'),
partialsDir: path.join(__dirname, '/views/partials')
}));

app.set('view engine', 'hbs');

/* ROUTER */
const router = require('./router/tvhRouter');
app.use('/', router);

app.use(express.static(__dirname));
app.use(express.static('/public'));

/* PORT */
app.listen(port, function(){
    console.log("Listening to http://localhost:" + port);
});