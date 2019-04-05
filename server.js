
const express = require('express');
const path = require('path');
const app = express();
var fs = require("fs");
var iconv = require("iconv-lite");
const router = express.Router();
var questions = require('./question.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 



//  Manages response in the server to questions request from client and returns JSON with statement and options
app.use('/apis',router);
router.get('/getQuestions',(req,res) => {
    var inputQuestions = fs.readFileSync("PREGUNTAS.txt",{encoding:"binary"});
    var outputQuestions = iconv.decode(inputQuestions,"ISO-8859-1");
    var inputUser = fs.readFileSync("INFORMACION.txt",{encoding:"binary"});
    var outputUser = iconv.decode(inputUser,"ISO-8859-1");    
    var output = questions.createQuestion(outputUser,outputQuestions)
    res.send(output);   
})

//  Manages response from client i the front and process the answers opposite user data

router.post('/getUserResponse',(req,res) => {
    var input = req.body;
    var inputUser = fs.readFileSync("INFORMACION.txt",{encoding:"binary"});
    var outputUser = iconv.decode(inputUser,"ISO-8859-1");
    var output = input

    res.send(input)
    console.log(req.body);
})



app.use(express.static(__dirname + '/dist/client-validator'));

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/dist/client-validatorindex.html'));
});

app.listen(process.env.PORT || 8080);


