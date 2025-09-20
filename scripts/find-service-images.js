require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para buscar imágenes de servicios
async function findServiceImages() {
  try {
    console.log('🔍 Buscando imágenes de servicios en Cloudinary...\n');
    
    // Buscar todas las imágenes
    const result = await cloudinary.search
      .expression('resource_type:image')
      .sort_by([['created_at', 'desc']])
      .max_results(50)
      .execute();
    
    console.log(`📊 Total de imágenes encontradas: ${result.total_count}\n`);
    
    // Filtrar imágenes que contengan "sara" en el nombre
    const saraImages = result.resources.filter(image => 
      image.public_id.toLowerCase().includes('sara')
    );
    
    console.log('🖼️  Imágenes que contienen "sara":');
    console.log('=====================================');
    
    saraImages.forEach((image, index) => {
      console.log(`${index + 1}. ID: ${image.public_id}`);
      console.log(`   URL: ${image.secure_url}`);
      console.log(`   Formato: ${image.format}`);
      console.log(`   Tamaño: ${image.width}x${image.height}`);
      console.log(`   Creada: ${new Date(image.created_at).toLocaleDateString()}`);
      console.log('   ---');
    });
    
    // Buscar específicamente por servicios
    const serviceKeywords = ['facial', 'depilacion', 'masaje', 'laminado', 'micropigmentacion', 'lifting', 'cauterizacion'];
    
    console.log('\n🎯 Imágenes por servicio:');
    console.log('========================');
    
    serviceKeywords.forEach(keyword => {
      const matchingImages = result.resources.filter(image => 
        image.public_id.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (matchingImages.length > 0) {
        console.log(`\n📋 ${keyword.toUpperCase()}:`);
        matchingImages.forEach(image => {
          console.log(`   - ${image.public_id}`);
        });
      }
    });
    
    // Mostrar todas las imágenes recientes para referencia
    console.log('\n📅 Todas las imágenes recientes:');
    console.log('===============================');
    
    result.resources.slice(0, 20).forEach((image, index) => {
      console.log(`${index + 1}. ${image.public_id} (${image.format})`);
    });
    
  } catch (error) {
    console.error('❌ Error buscando imágenes:', error.message);
  }
}

// Ejecutar la búsqueda
findServiceImages();
