var statement, options, data, topics


topics = ["BCO COLPATRIA", "DIRECCION", "CELULAR"]; 

exports.createQuestion = function(dataUser, dataQuestions){

    var dataArray= new Data(dataQuestions,"questions").readInfo()
    var user = new Data(dataUser,"user").readInfo();
    var questions = [];
     
        for(let i=0; i<topics.length; i++){
          for(let j = 0; j<dataArray.length;j++){
            let index = dataArray[j].indexOf(topics[i])
            if( index != -1 ){
              let options = new Options(user,topics[i],4).generateOptions();
              let question = new Question(dataArray[j],options,topics[i])
              questions.push(question); 
              break
            }
          }
        }
      

      return JSON.stringify(questions)
}

exports.validateUserRequest= function(dataUser, Response){
    
}

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
    isBank(bankQuery){
        let answer;
        answer = this._banks.some(function(bank){return bankQuery == bank});
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





