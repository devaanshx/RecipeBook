import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";

export interface AuthResponseData{
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: string
}


@Injectable({providedIn:"root"})
export class AuthService{

    private tokenExpirationTimer;

    user = new BehaviorSubject<User>(null);
    
    constructor(private http: HttpClient, private router: Router) { }


    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }
    
    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDzYJj0Wt_sJMCbTPcVHEPhshyTmtg8k2Q', {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError),
            tap(responseData => {
                this.handleAuthentication(responseData.email,responseData.localId,responseData.idToken,+responseData.expiresIn)
            })
        );
    }


    signin(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDzYJj0Wt_sJMCbTPcVHEPhshyTmtg8k2Q', {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError),
            tap(responseData => {
                this.handleAuthentication(responseData.email,responseData.localId,responseData.idToken,+responseData.expiresIn)
            })
        );
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => { 
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(email:string,userId:string,token:string,expiresIn:number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
                const user = new User( email, userId, token, expirationDate )
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }
    
    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = "An unknown error occured";
            if (!errorResponse.error || !errorResponse.error.error) {
                return throwError(errorMessage);
            }
            switch (errorResponse.error.error.message) {
                case 'EMAIL_NOT_FOUND':
                    errorMessage = "This Email address is not registered with any account";
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage = "Invalid Password. Please try again.";
                    break;
                case 'EMAIL_EXISTS':
                    errorMessage = "This Email address is already registered with an account. Please use another one or try logging in.";
                    break;
            }
            return throwError(errorMessage);
    }

}