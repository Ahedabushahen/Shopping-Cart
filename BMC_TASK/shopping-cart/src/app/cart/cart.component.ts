import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  displayedCart: any[] = [];
  currentUser: any;
  cartPerLoad: number = 5; 
  cartIndex: number = 0; 

  @ViewChild('loadTrigger', { static: false }) loadTrigger!: ElementRef;

  constructor(private router: Router) {}

  ngOnInit() {
    // Retrieve the logged-in user from localStorage
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (this.currentUser) {
      
      const savedCart = localStorage.getItem(`cart_${this.currentUser.email}`);
      this.cart = savedCart ? JSON.parse(savedCart) : [];
      this.loadMoreCartItems(); // Load the initial batch of items
    }

    // Set up lazy loading with IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.loadMoreCartItems();
      }
    });

    observer.observe(this.loadTrigger.nativeElement);
  }


  loadMoreCartItems() {
    const nextCartItems = this.cart.slice(this.cartIndex, this.cartIndex + this.cartPerLoad);
    this.displayedCart = [...this.displayedCart, ...nextCartItems];
    this.cartIndex += this.cartPerLoad;
  }

  increaseQuantity(product: any) {
    product.quantity += 1;
    this.updateCart();
  }

  decreaseQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity -= 1;
      this.updateCart();
    }
  }

  removeFromCart(product: any) {
    const index = this.cart.indexOf(product);
    if (index > -1) {
      this.cart.splice(index, 1);
      this.displayedCart = this.cart.slice(0, this.cartIndex); 
      this.updateCart();
    }
  }

  updateCart() {
    if (this.currentUser) {
      localStorage.setItem(`cart_${this.currentUser.email}`, JSON.stringify(this.cart));
    }
  }

  getTotalPrice(product: any) {
    return product.price * product.quantity;
  }

  navigateToProductList() {
    this.router.navigate(['/product-list']);
  }

  navigateToMainPage() {
    this.router.navigate(['/application']);
  }
}
