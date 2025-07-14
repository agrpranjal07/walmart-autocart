import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

async function findProductsByQuery(query) {
  const username = process.env.OXYLABS_USERNAME;
  const password = process.env.OXYLABS_PASSWORD;

  if (!username || !password) {
    console.warn('Oxylabs credentials not found, returning mock data');
    return [];
  }

  const requestBody = {
    source: 'walmart_search',
    query: query,
    parse: true
  };

  try {
    const response = await axios.post(
      'https://realtime.oxylabs.io/v1/queries',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        }
      }
    );
    if (response.status !== 200) {
      console.error('Oxylabs API error:', response.status, response.statusText);
      return [];
    }
    const results = response.data?.results?.[0]?.content?.results || [];
    

    return results.slice(0, 6).map((item, index) => ({
      id: String(index),
      name: item?.general?.title || 'Unknown Product',
      price: {
        price: item?.price?.price || 0,
        currency: item?.price?.currency || 'USD',
        price_min: item?.price?.price_min || item?.price?.price || 0,
        price_max: item?.price?.price_max || item?.price?.price || 0
      },
      image: item?.general?.image || `https://via.placeholder.com/200x200/0071ce/ffffff?text=Image`,
      rating: item?.rating?.rating || 0,
      reviews: item?.rating?.count || 0
    }));

  } catch (error) {
    console.error('Oxylabs API error:', error.message);
    return [];
  }
}

app.post('/api/search-products', async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Input should be an array of { name, query }' });
    }
    console.log('Received products for search:', products);
    const searchMap = {};

    for (const product of products) {
      const { name, query } = product;

      if (!name?.trim() || !query?.trim()) continue;

      const cleanedName = name.trim().toLowerCase();
      const cleanedQuery = query.trim();

      const productList = await findProductsByQuery(cleanedQuery);
       console.log('Search results:', productList);

      searchMap[cleanedName] = productList;
    }
   
    res.json(searchMap);
  } catch (error) {
    console.error('Search service error:', error);
    res.status(500).json({ error: 'Internal search failure' });
  }
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Search service running on port ${PORT}`);
});
