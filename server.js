const express = require('express');
const path = require('path');
const Datastore = require('nedb-promises');

const app = express();
const PORT = process.env.PORT || 3000;

const db = Datastore.create({
  filename: path.join(__dirname, 'hits.db'),
  autoload: true
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


app.get('/hits/:pageID', async (req, res) => {
  const pageID = req.params.pageID;
  
  try {
    // Find the page in the database or create a new entry
    let page = await db.findOne({ pageID });
    
    if (!page) {
      // If the page doesn't exist, create it with a hit count of 1
      page = { pageID, hits: 1 };
      await db.insert(page);
    } else {
      // If the page exists, increment its hit count
      page.hits++;
      await db.update({ pageID }, { $set: { hits: page.hits } });
    }
    
    res.json({ pageID, hits: page.hits });
  } catch (error) {
    console.error('Error updating hit count:', error);
    res.status(500).json({ error: 'Failed to update hit count' });
  }
});

// Route to get hit counts for all pages
app.get('/hits', async (req, res) => {
  try {
    const pages = await db.find({});
    res.json(pages);
  } catch (error) {
    console.error('Error fetching hit counts:', error);
    res.status(500).json({ error: 'Failed to fetch hit counts' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});