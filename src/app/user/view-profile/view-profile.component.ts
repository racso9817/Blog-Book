import { Component, OnInit } from '@angular/core';
import { ACrudService } from 'src/app/Authentication/shared/acrud.service';
import { ProfileComponent } from '../profile/profile.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/Authentication/shared/auth.service';
import { getuid } from 'process';
import { Profile } from 'src/app/Authentication/shared/user.model';
import { map } from 'rxjs/operators';
import { CrudService } from 'src/app/Unauthenticated/shared/crud.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  unameParam: string
  ProfileData: any
  username: string;
  isAuthenticated = false;
  myuname: string
  isloading: boolean = true;
  private userSub: Subscription;
  ismyself: boolean = false

  profileReturned: any
  uid: any
  userInfo: any

  //variables para conocer rol del usuario
  isStudent: boolean
  isTeacher: boolean
  isAdmin: boolean

  //contadores para saber las publicaciones (posts) del usuario
  pbcount: number = 0
  prcount: number = 0;
  allcount: number = 0

  constructor(
    private acrud: ACrudService,
    private crud: CrudService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore
    ) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      if (user) {
        this.isAuthenticated = !!user;
      }
    });
    //console.log(this.userSub)
    // console.log(this.route.params)    
    this.route.params
      .subscribe(
        (params: Params) => {
          this.unameParam = params['username'];
          // console.log(this.unameParam)
          this.getUidFromService()
          if (this.isAuthenticated) {
            this.acrud.getProfile().subscribe(d => {
              let x = this.acrud.seprate(d)
              this.isStudent = x[0].isStudent
              this.isTeacher = x[0].isTeacher
              this.isAdmin = x[0].isAdmin
              this.myuname = x[0].uname
              if (this.myuname == this.unameParam) {
                this.ismyself = true;
                this.getPrfoileFromPersonalDb()
              }
              else {
                this.ismyself = false
                this.getPrfoileFromPublicDb()
              }
            })
          }
          if (!this.isAuthenticated) {
            this.ismyself = false
            this.getPrfoileFromPublicDb()
          }
        });
  }

  getPrfoileFromPublicDb() {
    this.isloading = true
    this.acrud.getPublicProfile(this.unameParam).subscribe(d => {
      let x = this.acrud.seprate(d)
      this.ProfileData = x[0]
      this.isloading = false
    })
  }

  getPrfoileFromPersonalDb() {
    this.isloading = true
    this.acrud.getProfile().subscribe(d => {
      let x = this.acrud.seprate(d)
      this.ProfileData = x[0]
      this.username = this.ProfileData.uname
      this.isloading = false
    })
  }

  getUidFromService() {
    this.acrud.getPublicProfile(this.unameParam).subscribe(d => {
      let x = this.acrud.seprate(d)        
      if (x[0]) {
        let y = x[0].id
        this.getPublicPostsFromProfileId(y)
        this.getPrivatePostsFromProfileId(y)
      }
      else {
        this.router.navigate(["home"])
      }
    })
  }

  getPrivatePostsFromProfileId(y: any) {
    this.acrud.getPrivateFromProfileId(y).subscribe(d => {
      let x = this.acrud.seprate(d)
      this.prcount = x.length
      this.allcount += this.prcount
    })
  }

  getPublicPostsFromProfileId(y: any) {
    this.acrud.getPublicPostsFromProfileId(y).subscribe(d => {
      let x = this.acrud.seprate(d)
      this.pbcount = x.length
      this.allcount += this.pbcount
    })
  }


  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
