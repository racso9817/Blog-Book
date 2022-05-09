import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ACrudService } from 'src/app/Authentication/shared/acrud.service';
import { AuthService } from 'src/app/Authentication/shared/auth.service';
import { CrudService } from 'src/app/Unauthenticated/shared/crud.service';
import { UPost } from 'src/app/Unauthenticated/shared/UPost.model';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

  //Variables y todo para mostrar los datos de los profesores
  data: UPost[];
  sorted: UPost[];
  featuredPost: any
  isFetching: boolean = false
  searchText
  featuredPostsorted: any[];
  commenData: any = []
  error: string;

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
    private acrud: ACrudService,
    private router: Router,
    private firebaseService: CrudService,
    private fb: FormBuilder,
    private cd: CrudService,
    private toastr: ToastrService,
    config: NgbCarouselConfig,
  ) {
    config.interval = 5000;
		config.wrap = false;
		config.keyboard = false;
		config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
   }

   showNavigationIndicators = true;
   showNavigationArrows = true;
   paused = false;
   unpauseOnArrow = false;
   pauseOnIndicator = false;
   pauseOnHover = true;

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

    // Código para obtener los posts de los profesores
    this.getAllPost()
    this.getFeaturedPost()
  }

  allDocumentsUploadedVerification(){  //verificar si el profesor completó todos los documentos requeridos
    if(this.isTeacher && this.cedulaUploaded && this.tituloUploaded){
      this.allDocumentsUploaded = true
    }
    else{
      this.allDocumentsUploaded = false
    }
  }

  // Parte del código para ESTUDIANTE, BARRA DE BUSQUEDA Y TODA LA DEMAS PIJA
  
  getAllPost() {
    this.isFetching = true;
    this.acrud.getAllPost().then((x: any) => {
      this.isFetching = false
      this.data = x
      this.sortDesecending(this.data)
    })
  }
  
  sortDesecending(data) {
    this.sorted = data.sort((a: any, b: any) =>
      <any>new Date(b.created_date) - <any>new Date(a.created_date)
    )
  }
 
  onReadMore(index) {

  }

  getFeaturedPost() {
    this.acrud.getFeaturedPost().then(x => {
      let c = 0
      this.featuredPost = x
      for (let i in this.featuredPost) {
        let y = this.acrud.seprate(this.featuredPost[i].commentData)
        this.commenData.push(y)
      }
      console.log(this.commenData)
      console.log(this.featuredPost)
    },
      err => {
        console.log(err)
      })


  }

  public_data() {
    this.isFetching = true;
    this.cd.get_public_post()
      .subscribe(result => {
        this.data = result.map(e => {
          return {
            ...e.payload.doc.data() as {}
          } as UPost

        })
        this.isFetching = false;
        console.log(this.data)
      },
        err => {
          this.isFetching = false;
          this.error = err

        })
       console.log(this.data)
    catchError(error => {
      throw new Error('Error: Getting document:' + error); // throw an Error
    });

  }



 
}
