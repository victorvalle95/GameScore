import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { 
    this.registerForm = this.formBuilder.group({
      firstName:['', Validators.required],
      lastName:['', Validators.required],
      email:['', Validators.required],
      mediaCompany:[''],
      phone:['', Validators.required],
      username:['', Validators.required],
      password:['', Validators.required],
    })
  }

  ngOnInit() {
  }

}
