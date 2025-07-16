// api/create-cms-item.js
export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get environment variables
    const API_TOKEN = process.env.WEBFLOW_API_TOKEN;
    const COLLECTION_ID = process.env.WEBFLOW_COLLECTION_ID;

    if (!API_TOKEN || !COLLECTION_ID) {
      throw new Error('Missing API configuration');
    }

    // Get form data from request body
    const formData = req.body;
    
    // Validate required fields - only check for name now
    if (!formData.name) {
      return res.status(400).json({ 
        error: 'Missing required field: name' 
      });
    }

    // Prepare the CMS item data - only name and slug
    const itemData = {
      fieldData: {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      },
      isDraft: false
    };

    // Make API call to Webflow
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
    console.error('Error creating CMS item:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}