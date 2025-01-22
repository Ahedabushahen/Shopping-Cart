import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as Papa from 'papaparse'; // For parsing the CSV file
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  currentUser: any;

  // Lazy loading variables
  displayedProducts: any[] = [];
  productsPerLoad: number = 10; 
  @ViewChild('loadTrigger') loadTrigger!: ElementRef;

  // Filter variables
  selectedColor: string = '';
  selectedSize: string = '';
  selectedCategory: string = '';
  priceRange: number[] = [0, 1000]; 
  minPrice: any;
  maxPrice: any;
  priceError: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCSV(); 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  ngAfterViewInit(): void {
    // Set up IntersectionObserver for lazy loading
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.loadMoreProducts();
      }
    });

    // Observe the load trigger element
    observer.observe(this.loadTrigger.nativeElement);
  }

  // Load and parse the CSV file
  loadCSV() {
    const csvFilePath = 'assets/product_template.csv'; 
    fetch(csvFilePath)
      .then(response => response.text())
      .then(data => {
        Papa.parse(data, {
          header: true,
          complete: (result) => {
            this.products = result.data.map((product: any) => {
              const sizesStock = product['sizes_stock'] ? product['sizes_stock'].split(',') : [];
              const availableSizes = sizesStock
                .map((stock: string) => {
                  const [size, quantity] = stock.split(':');
                  return { size, quantity: parseInt(quantity, 10) };
                })
                .filter((sizeData: any) => sizeData.quantity > 0)
                .map((sizeData: any) => sizeData.size);

              const availableCategories = product['category'] ? product['category'].split(',') : [];

              return {
                name: product['name'],
                price: parseFloat(product['wholesale_price']), 
                image: product['image_1'] || 'assets/default-image.png', 
                color: product['color'],
                categories: availableCategories,
                availableSizes: availableSizes,
              };
            });

            this.filteredProducts = this.products; 
            this.displayedProducts = this.filteredProducts.slice(0, this.productsPerLoad); // Load initial products
          },
          error: (err: any) => {
            console.error('Error loading CSV file:', err);
          }
        });
      });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter((product) => {
      return (
        this.filterByPrice(product) &&
        (this.selectedColor ? product.color === this.selectedColor : true) &&
        (this.selectedSize ? product.availableSizes.includes(this.selectedSize) : true) &&
        (this.selectedCategory ? product.categories.includes(this.selectedCategory) : true)
      );
    });
    this.displayedProducts = this.filteredProducts.slice(0, this.productsPerLoad); // Reset displayed products after filtering
  }

  filterByPrice(product: any): boolean {
    if(this.minPrice > this.maxPrice) {
      this.priceError = true;
      return false;
    } else {  
      this.priceError = false;
      const price = product.price;
      const minPrice = this.minPrice || 0;
      const maxPrice = this.maxPrice || 1000;
      return price >= minPrice && price <= maxPrice;
    }
  }

  loadMoreProducts() {
    const nextBatch = this.filteredProducts.slice(this.displayedProducts.length, this.displayedProducts.length + this.productsPerLoad);
    this.displayedProducts = [...this.displayedProducts, ...nextBatch];
  }

  addToCart(product: any) {
    if (!this.currentUser) {
      alert('Please log in to add items to the cart.');
      return;
    }

    let cart = JSON.parse(localStorage.getItem(`cart_${this.currentUser.email}`) || '[]');
    const existingProduct = cart.find((item: any) => item.name === product.name);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }

    localStorage.setItem(`cart_${this.currentUser.email}`, JSON.stringify(cart));
    alert(`${product.name} has been added to the cart!`);
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  navigateToMainPage() {
    this.router.navigate(['/application']);
  }
}
