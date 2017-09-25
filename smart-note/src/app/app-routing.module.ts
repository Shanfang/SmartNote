

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';

const routes: Routes = [{
              path: "login" ,
              component: LoginComponent
            } ,
            {
              path: "" ,
               redirectTo: "/login" ,
              pathMatch: "full"
                      }, 
                      {
                        path: "home" ,
                        component: HomeComponent
                      } ,
            ];

@NgModule({
  imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }

