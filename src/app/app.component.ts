import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  questions:any = [];
  model:any[] = [];
  response:any[] = [];

  ngOnInit(){
    this.init()  
              
  }

  constructor(private http:HttpClient) { 
  }
  

  init(){
    let headers = {'Content-Type':'text/plain; charset=ISO-8859-1'};

    this.http.get('http://localhost:8080/apis/getQuestions',{headers,responseType: 'text'})
    .subscribe(data => {
      this.questions = JSON.parse(data);
      console.log( this.questions);
    });
  }

  validateUser(){
    let index = 0;
    this.questions.forEach(question=>{
      this.response.push({"_topic":question._topic, "_userAnswer":this.model[index]})
      index++
    });
    console.log(this.response);
    let body = this.response;
    
       

    this.http.post('http://localhost:8080/apis/getUserResponse',body ,httpOptions).subscribe(
      res =>{
        //handle response
        
        //this.setLoading(false);
      });

      
}


  
}
