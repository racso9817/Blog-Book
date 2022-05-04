import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ACrudService } from '../shared/acrud.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup-student',
  templateUrl: './signup-student.component.html',
  styleUrls: ['./signup-student.component.css']
})
export class SignupStudentComponent implements OnInit {

  isLoading = false;
  error: string = null;

  constructor(
    private authService: AuthService,
    private acrud: ACrudService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSignup(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    this.authService.SignUpStudent(email, password).then(d => {
          this.isLoading = false
          this.authService.logout()
        })
          .catch(e => {
            this.authService.logout()
            this.isLoading = false
            this.error = e
          })
  }
}
