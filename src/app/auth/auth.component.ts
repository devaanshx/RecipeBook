import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  isLoginMode = false;
  errorMessage = '';
  isLoading = false;
  authObs: Observable<AuthResponseData>;

  constructor(private authService: AuthService, private router:Router) { }
  

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {

    this.errorMessage = '';
    if (!form.valid) {
      return;
    }
    this.isLoading = true;

    const email = form.value.email;
    const password = form.value.password;


    if (this.isLoginMode) {
      this.authObs = this.authService.signin(email, password)
    }
    else {
      this.authObs = this.authService.signup(email, password)
    }
      
    this.authObs.subscribe(responseData => {
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      this.errorMessage = errorMessage;
      this.isLoading = false;
    })
    
    form.reset();
  }

  onHandleError() {
    this.errorMessage = null;
  }

}
