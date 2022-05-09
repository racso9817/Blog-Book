import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UCreatePostComponent } from './Unauthenticated/u-create-post/u-create-post.component';
import { UPostDetailComponent } from './Unauthenticated/upost-detail/upost-detail.component';
import { HomeComponent } from './Unauthenticated/home/home.component';
import { AuthComponentComponent } from './Authentication/auth-component/auth-component.component';
import { UserPostComponent } from './user/user-post/user-post.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ViewProfileComponent } from './user/view-profile/view-profile.component';
import { ViewOnlyPublicPostComponent } from './user/view-only-public-post/view-only-public-post.component';
import { AuthGuard } from './Authentication/shared/auth-guard.service';
import { ResetpasswordComponent } from './Authentication/resetpassword/resetpassword.component';
import { VerifyMailComponent } from './Authentication/verify-mail/verify-mail.component';
import { SobrenosotrosComponent } from './Unauthenticated/pages/sobrenosotros/sobrenosotros.component';
import { SoporteComponent } from './Unauthenticated/pages/soporte/soporte.component';
import { TrabajaconnosotrosComponent } from './Unauthenticated/pages/trabajaconnosotros/trabajaconnosotros.component';
import { SignupStudentComponent } from './Authentication/signup-student/signup-student.component';
import { SignupTeacherComponent } from './Authentication/signup-teacher/signup-teacher.component';
import { MainViewComponent } from './user/main-view/main-view.component';
import { UploadDocumentsComponent } from './user/upload-documents/upload-documents.component';
import { ACrudService } from './Authentication/shared/acrud.service';
import { StudentCoursesComponent } from './user/student-courses/student-courses.component';



const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'main/:id', component: UPostDetailComponent ,pathMatch: 'full'},
  { path: 'main/:id', component: UPostDetailComponent ,pathMatch: 'full'},
  { path: 'myprofile', component: ProfileComponent ,pathMatch: 'full',canActivate: [AuthGuard]},
  
  { path: 'myprofile/:username', component: ViewProfileComponent ,pathMatch: 'full'},
  { path: 'myprofile/:username/editProfile', component: ProfileComponent ,canActivate: [AuthGuard]},
  { path: 'myprofile/:username/publicposts', component: ViewOnlyPublicPostComponent},
  { path: 'myprofile/:username/publicposts/:id', component: UPostDetailComponent},
  { path: 'create-post', component: UCreatePostComponent, canActivate: [AuthGuard]},
  { path: 'auth', component: AuthComponentComponent },
  { path: 'verify-mail', component: VerifyMailComponent },
  { path: 'reset-password', component: ResetpasswordComponent },
  { path: 'myposts', redirectTo: 'myposts/allpost', pathMatch: 'full' },
  { path: 'myposts/:type', component: UserPostComponent,pathMatch: 'full'  },
 
  { path: 'myposts/:type/:id', component: UPostDetailComponent },
  { path: 'myposts/:type/:id/edit', component: UserEditComponent },
  { path: 'myposts/:type/:id/delete', component: UPostDetailComponent },
  { path: 'sobre', component: SobrenosotrosComponent },
  { path: 'trabaja', component: TrabajaconnosotrosComponent },
  { path: 'soporte', component: SoporteComponent },

  {path: 'signup-student', component: SignupStudentComponent},
  {path:'signup-teacher', component: SignupTeacherComponent},

  {path: 'main', component: MainViewComponent, canActivate: [AuthGuard]},
  {path: 'subirDocumentos', component: UploadDocumentsComponent, canActivate: [AuthGuard]},
  {path: 'mycourses', component: StudentCoursesComponent, canActivate: [AuthGuard]}
  
  //{path: '**/undefined', redirectTo: '/home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled',useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
  // constructor(
  //   public acrud: ACrudService
  // ){}

  // ngOnInit(){
  //   this.acrud.getProfile().subscribe(data => {
  //     let x = this.acrud.seprate(data);
  //     if(data[0].isTeacher){
  //       routes.push({path: 'subirDocumentos', component: UploadDocumentsComponent, canActivate: [AuthGuard]})
  //     }
  //   })
    // console.log(routes)
}

