const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = 3000;

const DEV_TOKEN = 'e3yTC9dOWvR4xxw2BkTCtzyoKDE5Spn9'

app.use(cors());
app.use(express.json());

// 📁 POST /create-folder
app.post('/create-folder', async (req, res) => {
    const { name, parentId } = req.body;

    console.log("📥 Creating folder with name:", name);
    console.log("📁 Parent folder ID (submitted):", parentId || 'none');

  try {
    const response = await fetch('https://api.box.com/2.0/folders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEV_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        parent: { id: parentId}
      })
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
        console.error('❌ Could not parse Box response as JSON');
        return res.status(500).json({ error: 'Invalid JSON from Box API' });
    }

    if (!response.ok) {
      console.error('🚫 Box API error:', data);
      return res.status(response.status).json(data);
    }
    console.log('✅ Folder created:', data.id);
    return res.status(200).json(data);

  } catch (error) {
    console.error('❌ Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Creates 'uploads/' folder for temp storage
const path = require('path');
const fs = require('fs');
const FormData = require('form-data'); 



app.post('/upload-file', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.resolve(req.file.path);
  const fileName = req.file.originalname;
  const parentId = req.body.parent_id || '0';

  console.log('📄 Received file:', fileName);
  console.log('📁 Uploading to Box folder ID:', parentId);

  try {
    const form = new FormData();
    form.append('attributes', JSON.stringify({
      name: fileName,
      parent: { id: parentId }
    }));
    form.append('file', fs.createReadStream(filePath));

    const response = await fetch('https://upload.box.com/api/2.0/files/content', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DEV_TOKEN}`, 

      },
      body: form
    });

    //console.log('📬 Box response status:', response.status);
    //console.log('📬 Box response headers:', [...response.headers.entries()]);


    let data;
    try {
      data = await response.json();
    } catch (err) {
      const rawText = await response.text();
      console.error('❌ Could not parse Box response as JSON');
      console.error('📦 Raw response:', rawText);
      return res.status(500).json({ error: 'Invalid JSON from Box API', body: rawText });
    }

    if (!response.ok) {
      console.error('❌ Box API error:', data);
      return res.status(response.status).json(data);
    }

    //console.log('✅ Uploaded to Box:', data);
    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).json({ error: 'Upload to Box failed' });
  } finally {
    fs.unlink(filePath, () => {});
  }
});



app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});