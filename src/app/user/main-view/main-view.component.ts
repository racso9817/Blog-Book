import { Component, OnInit } from '@angular/core';
import { ACrudService } from 'src/app/Authentication/shared/acrud.service';
import { AuthService } from 'src/app/Authentication/shared/auth.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

  //para saber qué tipo de usuario es
  isTeacher: boolean
  isStudent: boolean

  //si es profesor, se debe verificar que ha subido todos los documentos
  allDocumentsUploaded: boolean = false
  cedulaUploaded: boolean = false
  tituloUploaded: boolean = false

  message: string

  constructor(
    private authService: AuthService,
    private acrud: ACrudService
  ) { }

  ngOnInit(): void {
    this.acrud.getProfile().subscribe(s => {
      let x = this.acrud.seprate(s)
      this.isStudent = x[0].isStudent
      this.isTeacher = x[0].isTeacher
      console.log(this.isStudent)
      console.log(this.isTeacher)
      if(this.isStudent){
        this.message = "Bienvenido estudiante"
      }
      if(this.isTeacher){
        this.message = "Bienvenido profesor"
        // this.allDocumentsUploadedVerification()
      }
    })
  }

  allDocumentsUploadedVerification(){  //verificar si el profesor completó todos los documentos requeridos
    if(this.isTeacher && this.cedulaUploaded && this.tituloUploaded){
      this.allDocumentsUploaded = true
    }
    else{
      this.allDocumentsUploaded = false
    }
  }

}
