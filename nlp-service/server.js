const express = require('express');
const cors = require('cors');
const natural = require('natural');
const { WordTokenizer } = natural;
const tokenizer = new WordTokenizer();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/api/extract-products', (req, res) => {
    const data = req.body;
    const type = data.type;
    const content = data.data;

    if (!type || !content) {
        return res.status(400).send('Invalid input');
    }

    try {
        let products = [];
        
        if (type === 'text') {
            // Extract products from text input
            const lines = content.split('\n').filter(line => line.trim());
            
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine) continue;
                
                // Try to extract quantity and product name
                const quantityMatch = trimmedLine.match(/^(\d+)\s*(.+)$/);
                if (quantityMatch) {
                    const quantity = parseInt(quantityMatch[1]);
                    const productName = quantityMatch[2].replace(/^(x|of|bottles?|cans?|packs?|boxes?)\s*/i, '').trim();
                    products.push({ name: productName, quantity });
                } else {
                    // No quantity found, default to 1
                    const cleanName = trimmedLine.replace(/^[-•*]\s*/, '').trim();
                    if (cleanName) {
                        products.push({ name: cleanName, quantity: 1 });
                    }
                }
            }
            
            // If no products found, try simple tokenization
            if (products.length === 0) {
                try {
                    const words = tokenizer.tokenize(content.toLowerCase()) || [];
                    const commonProducts = ['milk', 'bread', 'eggs', 'butter', 'cheese', 'apple', 'banana', 'toothpaste', 'shampoo'];
                    const foundProducts = words.filter(word => commonProducts.includes(word));
                    products = foundProducts.map(word => ({ name: word, quantity: 1 }));
                } catch (tokenizeError) {
                    console.error('Tokenization failed:', tokenizeError);
                    // Fallback: split by spaces and filter common words
                    const words = content.toLowerCase().split(/\s+/);
                    const commonProducts = ['milk', 'bread', 'eggs', 'butter', 'cheese', 'apple', 'banana', 'toothpaste', 'shampoo'];
                    const foundProducts = words.filter(word => commonProducts.includes(word));
                    products = foundProducts.map(word => ({ name: word, quantity: 1 }));
                }
            }
        } else if (type === 'image') {
            // For image processing, return mock data for now
            products = [
                { name: 'milk', quantity: 1 },
                { name: 'bread', quantity: 1 },
                { name: 'eggs', quantity: 1 }
            ];
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('Error extracting products:', error);
        res.status(500).send('Failed to extract products');
    }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`NLP service running on port ${PORT}`);
});

