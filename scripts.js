// Global variable to store all product data
let productData = {};

// Function to fetch product data from JSON file
async function fetchProductData() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) {
      throw new Error('Failed to load product data');
    }
    const data = await response.json();
    productData = data;
    return data;
  } catch (error) {
    console.error('Error loading product data:', error);
    // Display error message on page
    document.getElementById('product-title').textContent = 'Error loading product';
    document.getElementById('product-description').innerHTML = '<p>Sorry, we could not load the product information. Please try again later.</p>';
  }
}

// Function to load product data
function loadProduct(productId) {
  // Get the product from our data
  const product = productData.products[productId];
  if (!product) {
    console.error('Product not found:', productId);
    return;
  }
  // Update page title
  document.title = `${product.name} - MIKDAM Timepieces & Gems`;
  // Update product details
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-title').textContent = product.name;
  document.getElementById('product-category').textContent = product.category;
  document.getElementById('product-price').textContent = product.price;
  document.getElementById('product-description').innerHTML = `<p>${product.description}</p>`;
  document.getElementById('product-reference').textContent = product.reference;
  document.getElementById('product-availability').textContent = product.availability;
  // Update product specifications
  const specsList = document.getElementById('product-specs').querySelector('ul');
  specsList.innerHTML = '';
  product.specs.forEach(spec => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${spec.key}:</span> ${spec.value}`;
    specsList.appendChild(li);
  });
  // Update product images
  const mainImage = document.getElementById('mainImage');
  mainImage.src = product.images[0];
  mainImage.alt = product.name;

  const thumbnailContainer = document.getElementById('thumbnail-container');
  thumbnailContainer.innerHTML = '';
  product.images.forEach((image, index) => {
    const thumbnail = document.createElement('div');
    thumbnail.classList.add('thumbnail');
    if (index === 0) thumbnail.classList.add('active');

    // Create onclick function that captures the current image
    thumbnail.onclick = function() {
      changeImage(image);

      // Update active thumbnail
      const thumbnails = document.querySelectorAll('.thumbnail');
      thumbnails.forEach(thumb => thumb.classList.remove('active'));
      this.classList.add('active');
    };

    const thumbImg = document.createElement('img');
    thumbImg.src = product.thumbnails[index];
    thumbImg.alt = `${product.name} - ${index + 1}`;
    thumbnail.appendChild(thumbImg);

    thumbnailContainer.appendChild(thumbnail);
  });
  // Update product rating
  const ratingContainer = document.getElementById('product-rating');
  ratingContainer.innerHTML = '';
  for (let i = 0; i < product.rating; i++) {
    const star = document.createElement('i');
    star.classList.add('fas', 'fa-star');
    ratingContainer.appendChild(star);
  }
  const reviews = document.createElement('span');
  reviews.textContent = `(${product.reviews} reviews)`;
  ratingContainer.appendChild(reviews);

  // Update tab contents
  updateTabContent('details-content', product.details);
  updateTabContent('craftsmanship-content', product.craftsmanship);
  loadReviews('reviews-content', product.reviewList);

  // Load related products
  loadRelatedProducts(productId);
}

// Helper function to update tab content
function updateTabContent(elementId, contentArray) {
  const container = document.getElementById(elementId);
  container.innerHTML = '';

  contentArray.forEach(paragraph => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    container.appendChild(p);
  });
}

// Function to load reviews
function loadReviews(elementId, reviewList) {
  const container = document.getElementById(elementId);
  container.innerHTML = '';

  reviewList.forEach(review => {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'review';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'review-header';

    const reviewerDiv = document.createElement('div');
    reviewerDiv.className = 'reviewer';

    const nameH4 = document.createElement('h4');
    nameH4.textContent = review.name;
    reviewerDiv.appendChild(nameH4);

    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'review-rating';
    for (let i = 0; i < review.rating; i++) {
      const star = document.createElement('i');
      star.className = 'fas fa-star';
      ratingDiv.appendChild(star);
    }
    reviewerDiv.appendChild(ratingDiv);

    headerDiv.appendChild(reviewerDiv);

    const dateSpan = document.createElement('span');
    dateSpan.className = 'review-date';
    dateSpan.textContent = review.date;
    headerDiv.appendChild(dateSpan);

    reviewDiv.appendChild(headerDiv);

    const textP = document.createElement('p');
    textP.textContent = review.text;
    reviewDiv.appendChild(textP);

    container.appendChild(reviewDiv);
  });
}

// Function to load related products
function loadRelatedProducts(currentProductId) {
  const relatedContainer = document.getElementById('related-products');
  relatedContainer.innerHTML = '';

  // Get related product IDs
  const relatedIds = productData.related[currentProductId] || [];

  relatedIds.forEach(id => {
    const product = productData.products[id];
    if (!product) return;

    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.onclick = function() {
      window.location.href = `product-template.html?product=${id}`;
    };

    const imageDiv = document.createElement('div');
    imageDiv.className = 'product-image';

    const img = document.createElement('img');
    img.src = product.images[0];
    img.alt = product.name;
    imageDiv.appendChild(img);

    const overlayDiv = document.createElement('div');
    overlayDiv.className = 'overlay';

    const viewLink = document.createElement('a');
    viewLink.href = `product-template.html?product=${id}`;
    viewLink.className = 'view-btn';
    viewLink.textContent = 'View Details';
    overlayDiv.appendChild(viewLink);

    imageDiv.appendChild(overlayDiv);
    productDiv.appendChild(imageDiv);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'product-info';

    const nameH3 = document.createElement('h3');
    nameH3.textContent = product.name;
    infoDiv.appendChild(nameH3);

    const categoryP = document.createElement('p');
    categoryP.className = 'category';
    categoryP.textContent = product.category;
    infoDiv.appendChild(categoryP);

    const priceP = document.createElement('p');
    priceP.className = 'price';
    priceP.textContent = product.price;
    infoDiv.appendChild(priceP);

    productDiv.appendChild(infoDiv);
    relatedContainer.appendChild(productDiv);
  });
}

// Function to change main image
function changeImage(src) {
  document.getElementById('mainImage').src = src;
}

// Quantity selector functions
function incrementQuantity() {
  const input = document.getElementById('quantity');
  input.value = parseInt(input.value) + 1;
}

function decrementQuantity() {
  const input = document.getElementById('quantity');
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
  }
}

// Tab functionality
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button
      button.classList.add('active');

      // Show corresponding content
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('mobile-menu');
  const navList = document.querySelector('.nav-list');
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', function() {
      navList.classList.toggle('active');
    });
  }
});


// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Setup tab functionality
  setupTabs();

  // Fetch product data
  await fetchProductData();

  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product') || 'gold-rolex'; // Default product

  // Load product
  loadProduct(productId);

  // Setup add to cart button
  const addToCartBtn = document.querySelector('.add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      const quantity = document.getElementById('quantity').value;
      alert(`Added ${quantity} item(s) to cart!`);
      // Here you would normally add items to a cart object or send to server
    });
  }

  // Setup wishlist button
  const wishlistBtn = document.querySelector('.wishlist-btn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', function() {
      const icon = this.querySelector('i');
      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        alert('Added to wishlist!');
      } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        alert('Removed from wishlist!');
      }
    });
  }

  // Mobile menu toggle functionality
  const menuToggle = document.getElementById('mobile-menu');
  const navList = document.querySelector('.nav-list');
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', function() {
      navList.classList.toggle('active');
    });
  }
});

