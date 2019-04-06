var topics // global variable with topics of the questions

topics = ["BCO COLPATRIA", "DIRECCION", "CELULAR"]; 

/** 
 * Exported function which allows the creation of questions with the user data readed from the
 * server and stored in the public var topics. Each one of the topics (as a key word) is readed in the strings loaded
 * from the topics array and is instanced in an object of class Question, using also the logic stored in the methods of
 * the class Options.
 * 
 * @ dataArray         questions readed from the txt file in the server.
 * @ user              instance of the class User generated with logic stored in class Data
 * @ questions         instances of the class Question created with the logic stored in the classes Question and Options
*/



exports.createQuestion = function(dataUser, dataQuestions){

    var dataArray= new Data(dataQuestions,"questions").readInfo()
    var user = new Data(dataUser,"user").readInfo();
    var questions = [];
     
        for(let i=0; i<topics.length; i++){
          for(let j = 0; j<dataArray.length;j++){
            let index = dataArray[j].indexOf(topics[i])   // key word is readed in each one of the statements of the questions
            if( index != -1 ){
              let options = new Options(user,topics[i],4).generateOptions();
              let question = new Question(dataArray[j],options,topics[i])
              questions.push(question); 
              break
            }
          }
        }
      

      return JSON.stringify(questions)

      /** 
 * Exported function which validates the answers of the side client with the informartion readed from the server of an specific
 * user. Instances the class User throughout logic inside in the class Data. Returns an object with the status of the validation
 * which is managed in the clientside app.
 * 
 * @ response          data received from the clientside app.
 * @ user              instance of the class User generated with logic stored in class Data
 * @ serverResponse    Object with the status of the validation
*/
}

exports.validateUserRequest= function(dataUser, response){
   
    var user = new Data(dataUser, "user").readInfo();
    var address = new Data(dataUser, "user").readInfo().getAddress();
    var cel = new Data(dataUser, "user").readInfo().getCel();
    
 

    var serverResponse = {status:"checked", user:"verified"}
    for(let i = 0; i< response.length; i++){            
       
        let answer

        if(response[i]._topic== "BCO COLPATRIA"){
            answer = (user.isThisBank("BCO COLPATRIA"))?"Si":"No";
        }else if(response[i]._topic == "DIRECCION"){
            answer = address
        }else if(response[i]._topic == "CELULAR"){
            answer = cel
        }    
              
        
        if( (answer != response[i]._answer) ){
            serverResponse = {status:"checked", user:"noVerified"}                     
            break
        }
       
    }

    return serverResponse

}

/** 
 * Class which drives the logic for the construction of the user and question information needed in the application. Depending
 * on the sort of data drived by the methods od the class it's possible to get an array of strings for the questions or instances
 * of the class User for the creation of the questions visibles on the clientside app or the validation of the response from there.
 * 
 * 
 * @ data              data readed from the server.
 * @ typedata          sort of data driven by the logic of the method readInfo()
 *  readInfo()        method which returns an array of questions or instances of the class user depending on the sort 
 *                     of data suministred
 * 
*/

class Data {
    
    constructor(data,typeData){
        this._data = data;
        this._typeData = typeData;

    }

    readInfo(){
        let result
        if(this._typeData == "questions"){
            result = this._data.split("\n");
            return result
        }else if(this._typeData == "user"){
            let array = [];
            let dataUser = [];
            array = this._data.split("\n");
            array.forEach(element=>{      
              dataUser.push(element.split(":")[1])
            })
            result = new User(dataUser[0],dataUser[1].split(","),dataUser[2],dataUser[3],dataUser[4]);  
            return result
        }        
    }
}

/** 
 * Class which stores and manages the info of the users readed from the server
 * 
 * 
 *  isThisBank(bank)         Search in all the banks asociated with an user and returns true or false depending on the existence
 *                            of the suministred bank string   
 *  
 * 
*/

class User {    
    constructor(name, banks, cel, age, address){
        this._name = name;
        this._banks = banks;
        this._cel = cel;
        this._age = age;
        this._address = address;
    }

    getName(){
        return this._name
    }
    getBanks(){
        return this._banks
    }

    isThisBank(bankQuery){
        let answer;
        answer = this._banks.some(function(bank){return bankQuery == bank});  // returns false if the bankQuery disired is not found
        return answer   
    }

    getCel(){
        return this._cel
    }
    getAge(){
        return this._age
    }
    getAddress(){
        return this._address
    }    
}


/** 
 * Class which stores and manages the info of the questions in the side and the client side of the app
 * 
 * 
 * @ options         array of strings with options generated by the logic of the class Options
 * @ topic           topic of the question depending on the key words readed in the data from the server   
 *  
 * 
*/


class Question {
    constructor(statement,options, topic){
        this._options = options;
        this._statement = statement;
        this._topic = topic;
    }

    getStatement(){
        return this._statement
    }

    getOptions(){
        return this._options
    }

    getTopic(){
        return this._topic
    }
    
}

/** 
 * Class which drives the logic of the generation of the options for each one of the questions depending on the key words stored in topics.
 * use instances of user for the creations of the arrays for each question with the same logic of validation of keywords readed
 * from the questions. Generates randomly addresses and cellphones with the specifications of cell mobile operators in Colombia.
 * 
 * 
 * @ user                   instance of class user required for the construction of the arrays of options
 * @ topic                  topic of the question depending on the key words readed in the data from the server
 * @ numberOptions          number of options desired wich would be generated randomly (including also the right answer)
 * 
 * generateOptions()        returns an array of options with the logic of the questions and keywords related with the user data
 * shuffleOptions(options)   shuffles an array the options randomly   
 * generateAddress()         generates randomly address with the logic Cra/Clle 1-100 # 1-100
 * generateCelNumbers()      generates randomly cell numbers with the logic of cell mobile operators in Colombia
 *  
 * 
*/

class Options {


   constructor(user, topic, numberOptions){

        this._numberOptions = numberOptions;
        this._sortQuestion = topic;         
        this._user = user;
        this._options = [];
               
   }

   generateOptions(){    
       
    switch (this._sortQuestion){
        case "BCO COLPATRIA":
            this._options.push("Si");
            this._options.push("No");     
            
        break;

        case "DIRECCION":
            while(this._options.length<this._numberOptions-1){
              this._options.push(this.generateAddress());  

            }                         
            this._options.push(this._user.getAddress());
            this._options = this.shuffleOptions(this._options);                            
        break;

        case "CELULAR":
            while(this._options.length<this._numberOptions-1){
                this._options.push(this.generateCelNumbers());
            }            
            this._options.push(this._user.getCel());
            this._options = this.shuffleOptions(this._options);                  
        break;
    }

    return this._options    

}

shuffleOptions(options){
    var j, x, i;
    for (i = options.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = options[i];
        options[i] = options[j];
        options[j] = x;
    }
    return options;
   }

   generateAddress(){
       let array = ["CALLE", "CARRERA"];
       let address= array[Math.floor(Math.random()*array.length)] + " " + Math.floor(Math.random()*100) + " # "  +  Math.floor(Math.random()*100) + " - " + Math.floor(Math.random()*100);
       
       return address
   }

   generateCelNumbers(){

       let prefix = Math.floor(Math.random()*52);    
       prefix = ((prefix>=0 && prefix <24) || (prefix>=50 && prefix <52))? prefix: Math.floor(Math.random()*24); 
       let celNumber = 3*Math.pow(10,9) + prefix*Math.pow(10,7) + (Math.floor(Math.random()*Math.pow(10,6)));
        return celNumber
   }
 
   

}





