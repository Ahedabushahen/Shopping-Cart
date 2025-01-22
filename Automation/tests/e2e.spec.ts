import { test, expect } from '@playwright/test';


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


const signUpNewUser = async (page) => {
  await page.goto('http://localhost:4200/signup');
  await page.fill('input[name="username"]', 'testuser');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
  await page.click('button[name="sign-upbtn"]');
  await page.click('button[name="gotolog-inbtn"]');
  await expect(page).toHaveURL('http://localhost:4200/login');
};


const logInUser = async (page) => {
  await page.goto('http://localhost:4200/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button[name="log-inbtn"]');
  await expect(page).toHaveURL('http://localhost:4200/application');
  const welcomeMessage = page.locator('.welcome-window');
  await expect(welcomeMessage).toContainText('Shop Now');
  const ShopNow = welcomeMessage.locator('button[name=ShopNowbtn]');
  await ShopNow.click();
};

test('Sign up a new user with validation', async ({ page }) => {
  
  await page.goto('http://localhost:4200/signup');
  
  await page.fill('input[name="username"]', 'Wrongtestuser');

  await page.fill('input[name="email"]', 'testuserWrongexample.com');
  await page.fill('input[name="password"]', 'Test!');
  
  await page.fill('input[name="confirmPassword"]', 'TestPassword123!');


  await expect(page.locator('form')).toContainText('Please enter a valid email');
  await expect(page.locator('form')).toContainText('Password must be at least 6 characters long');
  
  
  await signUpNewUser(page);
});

test('NEW User Sign-Up successfully', async ({ page }) => {
  
  await page.goto('http://localhost:4200/signup');
  await page.fill('input[name="username"]', 'testuser');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
  await page.click('button[name="sign-upbtn"]');
  await expect(page.locator('.modal-content')).toContainText('Your registration was successful!');
});


test('Log in with existing user credentials', async ({ page }) => {
  await signUpNewUser(page);
  await logInUser(page); 
});

test('Sign up for user that already exist', async ({ page }) => {
    await signUpNewUser(page);
    await page.goto('http://localhost:4200/signup');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    await page.click('button[name="sign-upbtn"]');
    await expect(page.locator('form')).toContainText('Email already exists.');
    
});



test('Add product to cart', async ({ page }) => {
  await signUpNewUser(page);
  await logInUser(page); 
 
  
  const firstProduct = page.locator('.featured-products .product-card').first();
  const addToCartButton = firstProduct.locator('button[name=addcart-btn]');
  await addToCartButton.click();

  await page.click('button[name=gotocart]');
  await expect(page).toHaveURL('http://localhost:4200/cart');

  const cartProduct = page.locator('.cart-item');
  await expect(cartProduct).toBeVisible();


  await page.click('button[name=gotohomepage]');
  await expect(page).toHaveURL('http://localhost:4200/application');
});

test('Log out after login', async ({ page }) => {
  await signUpNewUser(page); 
  await logInUser(page); 
  
  // Log out
  await page.click('button[name=logout-btn]');
  await expect(page).toHaveURL('http://localhost:4200/login');
  
});



test('Filter products by price, color, and size', async ({ page }) => {

 
  await signUpNewUser(page); 
  await logInUser(page); 

 
  await page.click('button[name=gotoproducts]');
  await expect(page).toHaveURL('http://localhost:4200/product-list');
  

  const productList = page.locator('div[name=product-item]');
  await expect(productList.first()).toBeVisible(); 

  
  await page.fill('input#minPrice', '50'); 
  await page.fill('input#maxPrice', '200'); 
  await page.selectOption('select#color', { label: 'Blue' }); 
  await page.selectOption('select#size', { label: 'M' }); 

  
  await page.waitForTimeout(500); 

  const filteredProducts = page.locator('div[name=product-item]:visible');
  await expect(filteredProducts).toHaveCount(0); 



});


test('Wrong price input', async ({ page }) => {
  
   
    await signUpNewUser(page); 
    await logInUser(page); 
  
    
    await page.click('button[name=gotoproducts]');
    await expect(page).toHaveURL('http://localhost:4200/product-list');
    
   
    const productList = page.locator('div[name=product-item]');
    await expect(productList.first()).toBeVisible(); 
  
    
    await page.fill('input#minPrice', '200'); 
    await page.fill('input#maxPrice', '20'); 

    await expect(page.locator('.filter-container')).toContainText('The Min Price is greater than Max price.');
     
  
  });



test('Lazy load products module', async ({ page }) => {

  await signUpNewUser(page);
  await logInUser(page);

  
  await page.click('button[name=gotoproducts]');
  await expect(page).toHaveURL('http://localhost:4200/product-list');

  const productGrid = page.locator('.product-grid');
  await expect(productGrid).toBeVisible(); 

  
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(500); 
});

test('Lazy load cart module', async ({ page }) => {
 
  await signUpNewUser(page);
  await logInUser(page);

  
  await page.click('button[name=gotoproducts]');
  const firstProduct = page.locator('.product-item').first();
  const addToCartButton = firstProduct.locator('button[name=addcart-btn]');
  await addToCartButton.click();

  
  await page.click('button[name=gotocart]');
  await expect(page).toHaveURL('http://localhost:4200/cart');

 
  const cartList = page.locator('.cart-item');
  await expect(cartList).toBeVisible(); 
});
