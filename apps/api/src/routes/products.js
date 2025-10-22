const express = require('express');
const database = require('../db');
const router = express.Router();

const dashboardRouter = require('./dashboard');

router.get('/', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { search, tag, tags, sort = 'name', page = 1, limit = 20 } = req.query;
    
    const products = database.getCollection('products');
    let query = {};


if (search) {
  const searchTerms = search.toLowerCase().split(' ').filter(term => term.length > 2);
  
  if (searchTerms.length > 0) {
    query.$and = searchTerms.map(term => {
      const baseTerm = term.replace(/s$/, '');
      const pluralTerm = term + 's';
      
      return {
        $or: [
          { name: { $regex: term, $options: 'i' } },
          { name: { $regex: baseTerm, $options: 'i' } },
          { name: { $regex: pluralTerm, $options: 'i' } },
          { description: { $regex: term, $options: 'i' } },
          { description: { $regex: baseTerm, $options: 'i' } },
          { description: { $regex: pluralTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(term, 'i')] } },
          { tags: { $in: [new RegExp(baseTerm, 'i')] } },
          { tags: { $in: [new RegExp(pluralTerm, 'i')] } },
          { category: { $regex: term, $options: 'i' } },
          { category: { $regex: baseTerm, $options: 'i' } },
          { category: { $regex: pluralTerm, $options: 'i' } }
        ]
      };
    });
  } else {

    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }
}

    let tagFilter = tags || tag;
    
    if (tagFilter) {

      const tagArray = Array.isArray(tagFilter) ? tagFilter : [tagFilter];
      
      if (tagArray.length > 0 && tagArray[0] !== '') {

        query.tags = { $all: tagArray };
      }
    }

 
    let sortOption = {};
    switch (sort) {
      case 'price':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'name':
      default:
        sortOption = { name: 1 };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

 
    const [items, totalCount] = await Promise.all([
      products.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .toArray(),
      products.countDocuments(query)
    ]);

    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(200, responseTime);
    
    res.json({
      items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNum)
      }
    });
  } catch (error) {
    console.error('Products list error:', error);
    
    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(500, responseTime);
    
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});


router.get('/:id', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { id } = req.params;
    
    const products = database.getCollection('products');
    const product = await products.findOne({ _id: id });

    if (!product) {
      const responseTime = Date.now() - startTime;
      dashboardRouter.trackAPIRequest(404, responseTime);
      return res.status(404).json({
        error: 'Product not found',
        id: id
      });
    }

    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(200, responseTime);
    res.json(product);
  } catch (error) {
    console.error('Product by ID error:', error);
    
    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(500, responseTime);
    
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});


router.post('/', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { name, description, price, category, tags, imageUrl, stock } = req.body;

 
    if (!name || !price || !category) {
      const responseTime = Date.now() - startTime;
      dashboardRouter.trackAPIRequest(400, responseTime);
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'price', 'category']
      });
    }

    if (price < 0) {
      const responseTime = Date.now() - startTime;
      dashboardRouter.trackAPIRequest(400, responseTime);
      return res.status(400).json({
        error: 'Price must be positive'
      });
    }

    const products = database.getCollection('products');
    
    const newProduct = {
      _id: `p${Date.now()}`,
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      tags: tags || [],
      imageUrl: imageUrl || '',
      stock: parseInt(stock) || 0,
      createdAt: new Date()
    };

    const result = await products.insertOne(newProduct);

    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(201, responseTime);
    
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(500, responseTime);
    
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

module.exports = router;