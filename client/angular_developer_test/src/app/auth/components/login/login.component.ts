import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loginForm:FormGroup

    constructor(private fb:FormBuilder, private snackBar:MatSnackBar,private authService:AuthService, private router:Router){
      this.loginForm = this.fb.group({
        email:[Validators.required,Validators.email],
        password:[Validators.required,Validators.minLength(6),Validators.maxLength(24)]
      })
    }

    onLogin(){
      if(this.loginForm.valid){
        const formData = this.loginForm.value
        this.authService.login(formData).subscribe({
          next:(res)=>{
            
            this.router.navigate(['/dashboard']);
          },
          error:(err:HttpErrorResponse)=>{
            this.snackBar.open(err.error.message,'Server Error',{
              horizontalPosition:"center",
              verticalPosition:'top'
            })
          }
        })
      }else{
        this.snackBar.open('Please fill all fields with valid details','Done',{
          horizontalPosition:'center',
          verticalPosition:'bottom'
        })
      }
    }
}
