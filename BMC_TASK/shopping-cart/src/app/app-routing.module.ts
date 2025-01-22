import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ApplicationPageComponent } from './application-page/application-page.component';  
import { ProductListComponent } from './product-list/product-list.component'; 
import { CartComponent } from './cart/cart.component';  
import { AuthGuard } from './auth.guard';  

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'application', component: ApplicationPageComponent, canActivate: [AuthGuard] },  
  { path: 'product-list', component: ProductListComponent, canActivate: [AuthGuard] },  
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },  
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Default route redirects to login
  { path: '**', redirectTo: '/login' },  // Fallback route redirects to login if no match
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
