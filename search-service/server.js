const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock Walmart product database
// const mockProducts = {
//   'toothpaste': [
//     { id: 'tp1', name: 'Colgate Total Whitening Toothpaste', price: 4.99, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Colgate', rating: 4.5, reviews: 1234 },
//     { id: 'tp2', name: 'Crest 3D White Toothpaste', price: 5.49, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Crest', rating: 4.3, reviews: 987 },
//     { id: 'tp3', name: 'Sensodyne Pronamel Toothpaste', price: 6.99, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Sensodyne', rating: 4.7, reviews: 756 },
//     { id: 'tp4', name: 'Arm & Hammer Toothpaste', price: 3.99, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Arm%26Hammer', rating: 4.1, reviews: 543 },
//     { id: 'tp5', name: 'Tom\'s of Maine Natural Toothpaste', price: 4.49, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Toms', rating: 4.4, reviews: 321 },
//     { id: 'tp6', name: 'Aquafresh Triple Protection Toothpaste', price: 3.79, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Aquafresh', rating: 4.2, reviews: 298 }
//   ],
//   'milk': [
//     { id: 'ml1', name: 'Great Value Whole Milk 1 Gallon', price: 3.68, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Whole+Milk', rating: 4.6, reviews: 2341 },
//     { id: 'ml2', name: 'Great Value 2% Milk 1 Gallon', price: 3.68, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=2%25+Milk', rating: 4.5, reviews: 1987 },
//     { id: 'ml3', name: 'Great Value 1% Milk 1 Gallon', price: 3.68, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=1%25+Milk', rating: 4.4, reviews: 1234 },
//     { id: 'ml4', name: 'Great Value Fat Free Milk 1 Gallon', price: 3.68, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Fat+Free', rating: 4.3, reviews: 876 },
//     { id: 'ml5', name: 'Organic Valley Whole Milk 1 Gallon', price: 5.98, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Organic', rating: 4.7, reviews: 543 },
//     { id: 'ml6', name: 'Fairlife 2% Milk 52 oz', price: 4.28, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Fairlife', rating: 4.8, reviews: 432 }
//   ],
//   'bread': [
//     { id: 'br1', name: 'Wonder Bread Classic White', price: 1.98, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Wonder', rating: 4.2, reviews: 1876 },
//     { id: 'br2', name: 'Nature\'s Own Honey Wheat', price: 2.48, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Natures+Own', rating: 4.4, reviews: 1432 },
//     { id: 'br3', name: 'Pepperidge Farm Whole Grain', price: 3.98, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Pepperidge', rating: 4.6, reviews: 987 },
//     { id: 'br4', name: 'Dave\'s Killer Bread Organic', price: 4.98, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Daves+Killer', rating: 4.8, reviews: 765 },
//     { id: 'br5', name: 'Great Value White Bread', price: 1.28, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Great+Value', rating: 4.0, reviews: 543 },
//     { id: 'br6', name: 'Arnold Country White Bread', price: 2.78, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Arnold', rating: 4.3, reviews: 321 }
//   ],
//   'eggs': [
//     { id: 'eg1', name: 'Great Value Large White Eggs 12 Count', price: 2.32, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=White+Eggs', rating: 4.4, reviews: 2876 },
//     { id: 'eg2', name: 'Great Value Large Brown Eggs 12 Count', price: 2.54, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Brown+Eggs', rating: 4.5, reviews: 1987 },
//     { id: 'eg3', name: 'Eggland\'s Best Large White Eggs', price: 3.78, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Egglands', rating: 4.6, reviews: 1234 },
//     { id: 'eg4', name: 'Great Value Organic Large Brown Eggs', price: 3.98, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Organic+Eggs', rating: 4.7, reviews: 876 },
//     { id: 'eg5', name: 'Pete & Gerry\'s Organic Eggs', price: 4.98, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Pete+Gerry', rating: 4.8, reviews: 543 },
//     { id: 'eg6', name: 'Land O Lakes Eggs 18 Count', price: 3.48, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Land+O+Lakes', rating: 4.3, reviews: 432 }
//   ],
//   'apple': [
//     { id: 'ap1', name: 'Gala Apples 3 lb Bag', price: 3.98, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Gala+Apples', rating: 4.3, reviews: 1876 },
//     { id: 'ap2', name: 'Honeycrisp Apples 3 lb Bag', price: 4.98, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Honeycrisp', rating: 4.6, reviews: 1432 },
//     { id: 'ap3', name: 'Granny Smith Apples 3 lb Bag', price: 3.78, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Granny+Smith', rating: 4.4, reviews: 987 },
//     { id: 'ap4', name: 'Red Delicious Apples 3 lb Bag', price: 3.48, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Red+Delicious', rating: 4.2, reviews: 765 },
//     { id: 'ap5', name: 'Fuji Apples 3 lb Bag', price: 4.28, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Fuji+Apples', rating: 4.5, reviews: 543 },
//     { id: 'ap6', name: 'Organic Gala Apples 2 lb Bag', price: 4.98, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Organic+Gala', rating: 4.7, reviews: 321 }
//   ],
//   'banana': [
//     { id: 'bn1', name: 'Great Value Bananas 1 lb', price: 0.68, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Bananas', rating: 4.3, reviews: 3241 },
//     { id: 'bn2', name: 'Organic Bananas 1 lb', price: 0.98, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Organic+Bananas', rating: 4.4, reviews: 1987 },
//     { id: 'bn3', name: 'Cavendish Bananas 1 lb', price: 0.78, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Cavendish', rating: 4.2, reviews: 1234 },
//     { id: 'bn4', name: 'Baby Bananas 1 lb', price: 1.48, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Baby+Bananas', rating: 4.1, reviews: 876 },
//     { id: 'bn5', name: 'Plantain Bananas 1 lb', price: 1.28, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Plantain', rating: 4.0, reviews: 543 },
//     { id: 'bn6', name: 'Red Bananas 1 lb', price: 1.98, image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Red+Bananas', rating: 4.3, reviews: 432 }
//   ]
// };

const mockProducts = {
  'toothpaste': [
    { 
      id: '0', 
      name: 'Colgate Total Whitening Toothpaste', 
      price:{
        "price": 1149.99,
        "currency": "USD",
        "price_min": 1149.99,
        "price_max": 1399.00
      }, 
      image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Colgate', 
      rating: 4.5, 
      reviews: 1234 
    },
    {
      id: '1', 
      name: 'Crest 3D White Brilliance Toothpaste', 
      price: {
        "price": 899.99,
        "currency": "USD",
        "price_min": 899.99,
        "price_max": 1099.00
      }, 
      image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Crest', 
      rating: 4.6, 
      reviews: 987
    },
    {
      id: '2', 
      name: 'Sensodyne Pronamel Gentle Whitening Toothpaste', 
      price: {
        "price": 999.99,
        "currency": "USD",
        "price_min": 999.99,
        "price_max": 1299.00
      }, 
      image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Sensodyne', 
      rating: 4.7, 
      reviews: 876
    },
    {
      id: '3', 
      name: 'Oral-B Pro-Health Toothpaste', 
      price: {
        "price": 799.99,
        "currency": "USD",
        "price_min": 799.99,
        "price_max": 999.00
      },
      image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Oral-B', 
      rating: 4.4, 
      reviews: 765
    }
    ],
  'shampoo': [
    { 
      id: '0', 
      name: 'Pantene Pro-V Daily Moisture Renewal Shampoo', 
      price: {
        "price": 599.99,
        "currency": "USD",
        "price_min": 599.99,
        "price_max": 799.00
      }, 
      image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Pantene', 
      rating: 4.3, 
      reviews: 654 
    },
    {
      id: '1', 
      name: 'Head & Shoulders Classic Clean Shampoo', 
      price: {
        "price": 499.99,
        "currency": "USD",
        "price_min": 499.99,
        "price_max": 699.00
      }, 
      image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Head&Shoulders', 
      rating: 4.2, 
      reviews: 432
    },
    {
      id: '2', 
      name: 'Dove Nutritive Solutions Daily Moisture Shampoo', 
      price: {
        "price": 699.99,
        "currency": "USD",
        "price_min": 699.99,
        "price_max": 899.00
      }, 
      image: 'https://via.placeholder.com/200x200/0071ce/ffffff?text=Dove', 
      rating: 4.4, 
      reviews: 543
    }
  ]
};

// Function to find products by name similarity
function findProductsByName(searchTerm) {
  const term = searchTerm.toLowerCase();
  
  // First, try exact match
  if (mockProducts[term]) {
    return mockProducts[term];
  }
  
  // Then try partial matches
  for (const [productName, products] of Object.entries(mockProducts)) {
    if (productName.includes(term) || term.includes(productName)) {
      return products;
    }
  }
  
  // If no match found, return a generic product set
  return [
    { 
      id: `generic_${Math.random().toString(36).substr(2, 9)}`, 
      name: `${searchTerm} - Generic Product`, 
      price: 9.99, 
      image: `https://via.placeholder.com/200x200/0071ce/ffffff?text=${encodeURIComponent(searchTerm)}`,
      rating: 4.0,
      reviews: 100
    }
  ];
}

app.post('/api/search-products', (req, res) => {
  try {
    const products = req.body;
    
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Products should be an array' });
    }
    
    const searchResults = {};
    
    for (const product of products) {
      if (product.name && product.name.trim()) {
        const foundProducts = findProductsByName(product.name.trim());
        searchResults[product.name] = foundProducts;
      }
    }
    
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Search service running on port ${PORT}`);
});
