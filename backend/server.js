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
    const nlpInput = {
      type: 'list',
      content: products.map(product => {
        return {"Product Name": product.name, Quantity: product.quantity};
      })
    };
    const nlpResponse = await axios.post(`http://localhost:${NLP_SERVICE_PORT}/api/extract-products`, nlpInput);
    
    const searchResponse = await axios.post(`http://localhost:${SEARCH_SERVICE_PORT}/api/search-products`, nlpResponse.data);
    console.log('Search Response:', searchResponse.data);
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
