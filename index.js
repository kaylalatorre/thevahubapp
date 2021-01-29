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
const base64 = require("byte-base64"); //for embedding resume .pdf files
const multer  = require('multer'); //for uploading images
const upload = multer();

/* EXPRESS APPLICATION */
const app = express();
const port = process.env.port || 9000;
 
/* INITIALIZING DOTENV (for db access info)*/
require('dotenv').config(); 
 
/* CONNECT DB */ 
 const db = require('./models/db');
 db.connect();

/* INITIALIZING COOKIES & SESSION, BODYPARSER */
 app.use(cookieParser());

 app.use(session({
 	secret: 'tvhsecret',
 	name: 'tvhsession',
 	resave: true,
 	saveUninitialized: true
 }));

/* BODY PARSER */
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

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
  runtimeOptions: {
	allowProtoPropertiesByDefault: true,
	allowProtoMethodsByDefault: true
  },
  layoutsDir: path.join(__dirname, '/views/layouts'),
  partialsDir: path.join(__dirname, '/views/partials'),
  helpers: {
	 genApplicName: function(applic){
//		 console.log(applic);
		 return applic.lName + ", " + applic.fName;
	 } 
  }
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