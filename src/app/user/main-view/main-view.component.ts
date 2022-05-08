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
  
  

  // Variables de nuestro amigo de la india que ni pti que usa y que no
  isAuthenticated = false;
  private userSub: Subscription;
  isloading: boolean
  isprofileset
  isimgloading: boolean
  exampleForm: FormGroup;
  values = ['Arte', 'Inglés', 'Música', 'Programación', 'Matemática', 'Química y Ciencia', 'Estudios Sociales', 'Lenguas', 'Otros..'];
  selected = 'Arte'
  imageSrc: string | ArrayBuffer;
  downloadURL: string;
  selectedFile: any;
  uploadPercent: Observable<number>;
  isloggedin: boolean = false;
  privacy: string
  username: any;
  uid: any;
  onChange(value) {

    this.selected = value;

  }

  validation_messages = {
    'title': [
      { type: 'required', message: 'El título es requerido.' }
    ],
    'desc': [
      { type: 'required', message: 'La descripción es requerida.' }
    ],
    'category': [
      { type: 'required', message: 'La Categoría es requerida.' },
    ],
    'name': [
      { type: 'required', message: 'Nombre es requerido.' },
    ],
    'precio': [
      { type: 'required', message: 'Precio es requerido.' },
    ]
  };


  // funcion para detectar los archivos? supongo, me dueles pana indio

  detectFiles(event) {
    this.isimgloading = true
    this.selectedFile = event.target.files[0];
    if (this.selectedFile.type.split('/')[0] !== 'image') {
      return alert('Pleas select an Image file');
    }
    this.firebaseService.getdata(this.selectedFile)
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);

    }
    this.firebaseService.uploadFile()
    this.uploadPercent = this.firebaseService.uploadPercent;
    this.firebaseService.downloadurlchange.subscribe((data: string) => {
      this.downloadURL = data

      this.isimgloading = false
    },
      err => {
        this.error = err
        console.log(err.message)
      })


  }


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
    console.log(this.getAllPost())
    console.log(this.getFeaturedPost())

    // Código para no se que chucha pero veamos si funciona
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      let uid=user.uid
      this.acrud.getProfileFromUid(uid).subscribe(data=>{
        let profile=this.acrud.seprate(data)
        this.isprofileset=profile[0].isProfileSet
        if(!this.isprofileset){
          this.router.navigate(['myprofile'])
          this.acrud.showWarningForProfileSet()
        }
      })
    })

   // para el formulario
    this.createForm();
    if (this.isAuthenticated) {
      this.getUidandUname()
    }
  }


   // Obtiene el uID y el uNAME del usuario

   getUidandUname() {
    this.isloading = true
    this.acrud.getProfile().subscribe(d => {
      let x = this.acrud.seprate(d)
      this.isloading = false
      this.username = x[0].uname
      this.uid = x[0].id
      this.acrud.sendUidandUname(this.username, this.uid)
      this.firebaseService.sendUidandUname(this.username, this.uid)
    },
      err => {
        this.error = err
      })
  }

  //////


  // El formulario
  createForm() {
    this.exampleForm = this.fb.group({
      imgurl: ['', Validators.required],
      title: ['', Validators.required],
      desc: ['', [Validators.required, Validators.minLength(50)]],
      category: [this.selected, Validators.required],
      subcategory: ['  ', Validators.required],
      name: ['', Validators.required],
      precio: ['', Validators.required],
      privacy: ["true"],

    });
  }

  //////////////////////

   // Funcion para subir el documento
   onSubmit(value: UPost) {
    if (!!this.isAuthenticated) {
      if (this.exampleForm.value.privacy == "true") {
        this.firebaseService.createUser(value)
      }
      this.acrud.createPost(value)
      this.exampleForm.reset();
      this.isloading = true
    }
    else {
      this.firebaseService.createUser(value)
        .then(
          res => {
            this.exampleForm.reset();
            this.router.navigate(['']);
          })
        .catch(err => {
          this.error = err
          console.log("err" + err)
        })
    }
  }

   // para que se borre todo al cerrar sesión
   ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  ///////////////////////////////////////////////////////////////

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
