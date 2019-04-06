import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

declare var $:any;
declare var Jquery:any;


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'  // headers for the htpp post method
  })
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


/** 
 * Class which drives the logic of front of the clientside app, generating communication with the serve and the logic of
 * generation and verification of user data stored in there. consumes a RestApi service stored in the server througout
 * http methods.
 * 
 * 
 * @ questions              array which is going to store the questions information from the server
 * @ model                  array which is going to store the questions answers colected in the input radio formulary 
 * @ response               array array which is going to drive the JSON array of objects sent to the server for the user validation
 * @ serverResponse         object which is going to store the response sent by the server for the user validation
 * 
 * init()                    get the questions info from the server and drives the front visualization depending on the response of the server
 * validateUser()            creates the JSON object and manages the sending of information to the server for its validation. Drives
 *                           the response of the server with the status of validation and generate the frontvisualization depending on that.
 
*/


export class AppComponent implements OnInit {

  questions:any[] = [];
  model:any[] = [];
  response:any[] = [];
  isCharged:boolean;
  isVerified:boolean;
  serverResponse:any = {
    status : "",
    user : ""
  }

  ngOnInit(){
    this.init()                
  }

  constructor(private http:HttpClient) {
     
  }
  

  init(){
    let headers = {'Content-Type':'text/plain; charset=ISO-8859-1'};  // headers for the get request

    this.http.get('http://localhost:8080/apis/getQuestions',{headers,responseType: 'text'})
    .subscribe(data => {
      if(data){
        this.questions = JSON.parse(data);
        this.isCharged = true
      } else{
        alert("Problemas con el servidor, inténtelo más tarde")
      }

    });
  }



  validateUser(){
    let index = 0;
    this.questions.forEach(question=>{
      this.response.push({"_topic" : String(question._topic), "_answer": String(this.model[index])})   // creation of JSON file which is the body of the post request   
      index++
    });
       
    let body = this.response;
    
       

    this.http.post('http://localhost:8080/apis/getUserResponse',body ,httpOptions).subscribe(
      res =>{
        if(res){
          this.serverResponse = res  

          if(this.serverResponse.user == "verified" ){
            alert("Usuario verificado satisfactoriamente")
            this.isVerified = true
          }else{
            alert("Los datos no coinciden")
            location.reload();
          }
        }else{
          alert("Problemas con el servidor, inténtelo más tarde")
        }
      
      });

      
}


  
}
