export async function POST(request) {
  try {
    const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;
    const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg';

    if (!REMOVE_BG_API_KEY) {
      return Response.json(
        { error: 'API key not configured on server' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile) {
      return Response.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    console.log(`[${new Date().toISOString()}] Processing image: ${imageFile.name} (${imageFile.size} bytes)`);

    // Create FormData for Remove.bg API
    const removebgFormData = new FormData();
    removebgFormData.append('image_file', imageFile);

    // Call Remove.bg API
    const response = await fetch(REMOVE_BG_API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      body: removebgFormData,
    });

    // Handle API errors
    if (response.status === 403) {
      return Response.json(
        { error: 'Invalid API key', message: 'Please check your Remove.bg API key' },
        { status: 403 }
      );
    }

    if (response.status === 402) {
      return Response.json(
        { error: 'API limit exceeded', message: 'You have reached your free tier limit (50 images/month)' },
        { status: 402 }
      );
    }

    if (!response.ok) {
      return Response.json(
        { error: `API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the image as blob
    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    console.log(`[${new Date().toISOString()}] Image processed successfully`);

    return Response.json({
      success: true,
      image: `data:image/png;base64,${base64}`,
      message: 'Background removed successfully'
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
