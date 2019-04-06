
const express = require('express'); // express server
const path = require('path');
const app = express();
var fs = require("fs");    // file system manager
var iconv = require("iconv-lite");  // charset converter
const router = express.Router();    // routing on the API
var questions = require('./question.js');
var bodyParser = require('body-parser');   // support json encoded bodies
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));   // support encoded bodies



/**
 *  Manages response in the server to questions
 *  request from client and returns JSON with statement and options
 */
app.use('/apis',router);
router.get('/getQuestions',(req,res) => {
    var inputQuestions = fs.readFileSync("PREGUNTAS.txt",{encoding:"binary"});
    var outputQuestions = iconv.decode(inputQuestions,"ISO-8859-1");
    var inputUser = fs.readFileSync("INFORMACION.txt",{encoding:"binary"});
    var outputUser = iconv.decode(inputUser,"ISO-8859-1");    
    var output = questions.createQuestion(outputUser,outputQuestions)
    res.send(output);   
})

/**
 * Manages the validation request from client in the front
 *  and process the answers opposite user data
 */

router.post('/getUserResponse',(req,res) => {
    var input = req.body;
    var inputUser = fs.readFileSync("INFORMACION.txt",{encoding:"binary"});
    var outputUser = iconv.decode(inputUser,"ISO-8859-1");
    var output = questions.validateUserRequest(outputUser,input)
    res.send(output)    
})

// Use express to define the directory to serve generated with Angular

app.use(express.static(__dirname + '/dist/client-validator'));

app.get('/*', function(req,res) {
    
 // Launch the server and listen on the default port 8080   
res.sendFile(path.join(__dirname+'/dist/client-validatorindex.html'));
});

app.listen(process.env.PORT || 8080);


