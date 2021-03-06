import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {User} from "../../shared/models/user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'kss-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  form:FormGroup;
  constructor(private userService:UserService,private router:Router) { }

  ngOnInit() {
      this.form = new FormGroup({
        'email':new FormControl(null,[Validators.required,Validators.email],this.formbiddenEmail.bind(this)),
        'password':new FormControl(null,[Validators.required,Validators.minLength(6)]),
        'name':new FormControl(null,[Validators.required]),
        'agree':new FormControl(false,[Validators.requiredTrue]),
      })
  }
  onSubmit(){
    const {email,password,name} = this.form.value;
    const user = new User(email,password,name)
  this.userService.createNewUser(user)
      .subscribe((user:User) => {
       this.router.navigate(['/login'],{
         queryParams:{
           nowCanLoggin:true
         }
       })
      })
  }
  formbiddenEmail(control:FormControl):Promise<any>{
      return new Promise((resolve,reject) => {
            this.userService.getUserByEmail(control.value)
                .subscribe((user:User) =>{
                    if(user){
                        resolve({forbiddenEmail:true})
                    } else {
                        resolve(null)
                    }
                })
      })
  }

}
