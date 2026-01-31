FashionZ — eCommerce Website

FashionZ is a modern, responsive front-end eCommerce website built with HTML, CSS, JavaScript, and Bootstrap. It is designed as a fast, lightweight storefront with a clear architecture that can be easily extended into a full-stack eCommerce platform.

Website Overview

FashionZ provides a complete shopping-site interface including:

Homepage with brand highlights and featured products

Product listing (shop) view

Individual product detail pages

About page for brand identity

Contact page with location and inquiry section

The site currently operates as a static eCommerce frontend, focusing on performance, simplicity, and clean UI.

Site Architecture
1. Presentation Layer (HTML)

Responsible for page structure and layout.

Main Pages

index.html — Homepage

shop.html — Product catalog

shop-single.html — Product details

about.html — Brand information

contact.html — Contact & location

2. Styling Layer (CSS)

Bootstrap for grid system and responsive layout

Custom CSS for branding, colors, typography, and UI refinements

Ensures consistent design across all screen sizes.

3. Interaction Layer (JavaScript)

Bootstrap JavaScript components

jQuery for DOM manipulation and UI behavior

Custom scripts for enhanced user experience

Handles navigation, animations, and interactive components.

4. Assets Layer
assets/
 ├── css/        → Stylesheets
 ├── js/         → JavaScript files
 ├── img/        → Product & banner images
 └── webfonts/   → Fonts and icons


All static resources are centralized for maintainability and performance.

5. Data Handling (Current)

Product information is statically defined in HTML

No backend or database integration

No persistent cart or checkout logic

This keeps the site fast and easy to deploy.

6. Backend-Ready Design (Future Scope)

FashionZ is structured to support future enhancements such as:

Backend APIs (products, users, orders)

Database integration

Authentication & authorization

Shopping cart and checkout flow

Payment gateway integration

The existing frontend can consume APIs without major structural changes.

Deployment

FashionZ can be deployed on:

Static hosting platforms

CDN-backed environments

Standard web servers

No server-side runtime is required in its current form.

Summary

FashionZ is a clean, scalable eCommerce frontend with:

Clear separation of concerns

Responsive design

Lightweight static architecture

Easy path to full-stack expansion

Update
-----------1------
Remove empty 
custom.js
Remove debug console.log
Fix cart total bug ✅ (Already done!)
Clean up analytics injection


