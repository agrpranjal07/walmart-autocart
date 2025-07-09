require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const NLP_SERVICE_PORT = 4001;
const SEARCH_SERVICE_PORT = 4002;

app.post('/api/process-products', async (req, res) => {
  try {
    const { products } = req.body;
    
    // If products are already provided (manual entry), skip NLP and go straight to search
    if (products && products.length > 0) {
      const searchResponse = await axios.post(`http://localhost:${SEARCH_SERVICE_PORT}/api/search-products`, products);
      res.status(200).json(searchResponse.data);
      return;
    }
    
    // If no products provided, this would be for text/image processing
    const nlpResponse = await axios.post(`http://localhost:${NLP_SERVICE_PORT}/api/extract-products`, req.body);
    const searchResponse = await axios.post(`http://localhost:${SEARCH_SERVICE_PORT}/api/search-products`, nlpResponse.data);

    res.status(200).json(searchResponse.data);
  } catch (error) {
    console.error('Error processing products:', error);
    res.status(500).send('Failed to process products');
  }
});

const PORT = process.env.PORT || 4000;
http.createServer({}, app).listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
