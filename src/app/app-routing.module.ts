import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainWindowComponent } from './main-window/main-window.component';
import { AuthGuardService } from './services/Auth Guard/auth-guard.service';

const routes: Routes = [
  { path: 'app', component: LoginComponent },
  { path: 'app/main', component: MainWindowComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/app' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
