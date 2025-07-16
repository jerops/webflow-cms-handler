// api/create-cms-item.js
export default async function handler(req, res) {
  console.log('=== DEBUG: Function called ===');
  console.log('Method:', req.method);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const API_TOKEN = process.env.WEBFLOW_API_TOKEN;
    const COLLECTION_ID = process.env.WEBFLOW_COLLECTION_ID;
    
    console.log('=== DEBUG: Environment Variables ===');
    console.log('API_TOKEN exists:', !!API_TOKEN);
    console.log('API_TOKEN length:', API_TOKEN ? API_TOKEN.length : 0);
    console.log('COLLECTION_ID:', COLLECTION_ID);

    if (!API_TOKEN || !COLLECTION_ID) {
      throw new Error('Missing API configuration');
    }

    const formData = req.body;
    console.log('=== DEBUG: Form Data ===');
    console.log('Form data:', formData);
    console.log('Name field:', formData.name);

    if (!formData.name) {
      return res.status(400).json({ 
        error: 'Missing required field: name' 
      });
    }

    const itemData = {
      fieldData: {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      },
      isDraft: false
    };

    console.log('=== DEBUG: Sending to Webflow ===');
    console.log('Item data:', JSON.stringify(itemData, null, 2));
    console.log('URL:', `https://api.webflow.com/v2/collections/${COLLECTION_ID}/items`);

    const response = await fetch(
      `https://api.webflow.com/v2/collections/${COLLECTION_ID}/items`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(itemData)
      }
    );

    const result = await response.json();
    
    console.log('=== DEBUG: Webflow Response ===');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (!response.ok) {
      console.error('Webflow API Error:', result);
      throw new Error(result.message || 'Failed to create CMS item');
    }

    res.status(200).json({
      success: true,
      message: 'CMS item created successfully',
      itemId: result.id
    });

  } catch (error) {
    console.error('=== DEBUG: Error ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}