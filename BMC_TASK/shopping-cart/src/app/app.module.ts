import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ApplicationPageComponent } from './application-page/application-page.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CartComponent } from './cart/cart.component';
import { AuthGuard } from './auth.guard';  

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ApplicationPageComponent,
    ProductListComponent,
    CartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    InfiniteScrollModule
  ],
  providers: [AuthGuard],  
  bootstrap: [AppComponent]
})
export class AppModule { }
