import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ACrudService } from 'src/app/Authentication/shared/acrud.service';
import { AuthService } from 'src/app/Authentication/shared/auth.service';
import { Profile } from 'src/app/Authentication/shared/user.model';
import { CrudService } from 'src/app/Unauthenticated/shared/crud.service';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.css']
})
export class UploadDocumentsComponent implements OnInit {

  isTeacher: boolean
  cedulaSrc: string | ArrayBuffer;
  tituloSrc: string | ArrayBuffer;

  cedulaYtituloForm: FormGroup;

  validation_messages = {
    'cedula': [
      { type: 'required', message: 'Cedula is required.' }
    ],
    'titulo': [
      { type: 'required', message: 'Titulo is required.' }
    ],
  }

  constructor(
    private authService: AuthService,
    private firebaseService: CrudService,
    private acrud: ACrudService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  detectFiles(event) {}

  CreateCedulaYTituloForm() {
    this.cedulaYtituloForm = this.fb.group({
      cedula: ['', Validators.required],
      titulo: ['', Validators.required],
    });
  }

  onSubmit(value: Profile){}

}
