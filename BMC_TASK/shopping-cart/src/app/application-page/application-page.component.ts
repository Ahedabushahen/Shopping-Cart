import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Papa from 'papaparse';

@Component({
  selector: 'app-application-page',
  templateUrl: './application-page.component.html',
  styleUrls: ['./application-page.component.css']
})
export class ApplicationPageComponent implements OnInit {
  currentUser: any;
  products: any[] = [];
  featuredProducts: any[] = [];
  latestProducts: any[] = [];
  showWelcomeWindow = false; 

  constructor(private router: Router) { }

  ngOnInit() {
    // Retrieve the current logged-in user from localStorage
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    
    if (this.currentUser && !localStorage.getItem('adShown')) {
      this.showWelcomeWindow = true; // Show the welcome window if the user has just logged in
      localStorage.setItem('adShown', 'true'); // Mark the advertisement as shown in localStorage
    }

   
    this.loadCSV();

    
  }

  // Function to close the welcome window
  closeWelcomeWindow() {
    this.showWelcomeWindow = false;
  }

  navigateToProductList() {
    this.router.navigate(['/product-list']);
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  // Function to load and parse the CSV file
  loadCSV() {
    const csvFilePath = 'assets/product_template.csv'; 
    fetch(csvFilePath)
      .then(response => response.text())
      .then(data => {
        Papa.parse(data, {
          header: true,
          complete: (result) => {
           
            this.products = result.data.map((product: any) => ({
              name: product['name'],
              price: product['wholesale_price'],
              image: product['image_1'] || 'assets/default-image.png', 
            }));

            // Set the featured and latest products after loading CSV
            this.featuredProducts = this.products.slice(0, 3);
            this.latestProducts = this.products.slice(-4, -1);
          },
          error: (err: any) => {
            console.error('Error loading CSV file:', err);
          }
        });
      });
  }

  // Add product to the cart and store it in localStorage for the current user
  addToCart(product: any) {
    if (!this.currentUser) {
      alert('Please log in to add items to the cart.');
      return;
    }

    let cart = JSON.parse(localStorage.getItem(`cart_${this.currentUser.email}`) || '[]');
    
    // Check if product is already in the cart
    const existingProduct = cart.find((item: any) => item.name === product.name);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }

    // Update localStorage with the new cart
    localStorage.setItem(`cart_${this.currentUser.email}`, JSON.stringify(cart));
    alert(`${product.name} has been added to the cart!`);
  }

  // Handle logout button click
  onLogout() {
    // Clear user login data from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adShown'); // Clear the adShown flag on logout
   

    // Navigate back to the login page
    this.router.navigate(['/login']);
  }
}
