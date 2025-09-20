require('dotenv').config({ path: '.env' });
const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function listImages() {
  try {
    console.log('🔍 Listando imágenes en Cloudinary...\n');
    
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 50
    });
    
    console.log(`📊 Total: ${result.total_count} imágenes\n`);
    
    // Mostrar todas las imágenes
    result.resources.forEach((image, index) => {
      console.log(`${index + 1}. ${image.public_id}`);
    });
    
    // Buscar imágenes con "sara"
    const saraImages = result.resources.filter(img => 
      img.public_id.toLowerCase().includes('sara')
    );
    
    console.log('\n🖼️  Imágenes con "sara":');
    saraImages.forEach(img => {
      console.log(`- ${img.public_id}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listImages();
