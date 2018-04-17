//Require the express module
//Require checks if the module exists in the library and if it is, includes it in the project
var express = require('express');

//Create an express app
var app = express();

//These next 2 lines allow us to retrieve submitted data
//Checks if it's in the library, then includes the module in the project
var bodyParser = require('body-parser');
//Loads the middleware function, body-parser
app.use(bodyParser.urlencoded({extended: true}));

//Checks if it's in the library, then includes the module in the project
var path = require('path');
//... now we can utilize the 'path' module ...

//
app.use(express.static(path.join(__dirname, './static')));

//Sets the views location path to the views folder
app.set('views', path.join(__dirname, './views'));
//Sets the view engine to EJS
app.set('view engine', 'ejs');


//require mongoose aka check if the module is in the library and if so, include it
var mongoose = require('mongoose');
//connect to our mongoDB, if it doesn't exist already, mongoose will create it- woot!
mongoose.connect('mongodb://localhost/quoteDB');


//Use native promises - still not super sure on this one..
mongoose.Promise = global.Promise;

//creating a new Schema
var QuoteSchema = new mongoose.Schema({
    author: String,
    text: String,
}, {timestamps: true});

//Setting this Schema in our Models as 'Quotes'
mongoose.model('Quote', QuoteSchema);
//Retrieving this Schema from our Models (named 'Quote')

//Assigning the variable Quote to the model named Quote
var Quote = mongoose.model('Quote');

//If the root route is requested, then the 'index' view file is loaded/rendered
app.get('/', function(req, res){
    //the index file is where we will obtain quote/author info via a form
    res.render('index');
})

app.post('/quotes', function(req, res){
    Quote.create(req.body, function(err){
        if(err){
            //If there are any error msgs, they will be logged to the console
            console.log(err);
        }
        //If there are no errors, this redirects the client to the 'quotes' route
        res.redirect('/quotes');
    });
});

//If the 'quotes' route is requested, then the 'quotes' view file will be renderered (if there are no errors)
app.get('/quotes', function(req, res){
    //Query to find all of the quotes in the DB
    Quote.find({}, function(err, results){
        if(err){
            //If there are any error msgs, they will be logged to the console
            console.log(err);
        }
        //If there are no errors, this renders the 'quotes' view with the results from the quotes query
        res.render('quotes', {quotes: results});
        });
    });

//Tells the app to listen on the port specified... 8000 in this case
app.listen(8000, function(){
    //Logs the msg to the console to verify that it is in fact working
    console.log("Listening on port 8000");
})