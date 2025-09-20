require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para subir una imagen
async function uploadImage(imagePath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      public_id: publicId,
      folder: 'acuario-spa',
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    });
    
    console.log(`✅ Subida exitosa: ${publicId}`);
    console.log(`   URL: ${result.secure_url}`);
    return result;
  } catch (error) {
    console.error(`❌ Error subiendo ${publicId}:`, error.message);
    return null;
  }
}

// Función principal
async function uploadAllImages() {
  const imagesDir = path.join(__dirname, '../public/assets/img');
  
  if (!fs.existsSync(imagesDir)) {
    console.error('❌ No se encontró la carpeta de imágenes');
    return;
  }

  const files = fs.readdirSync(imagesDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );

  console.log(`📁 Encontradas ${imageFiles.length} imágenes para subir...\n`);

  const results = [];
  
  for (const file of imageFiles) {
    const imagePath = path.join(imagesDir, file);
    const publicId = path.parse(file).name; // Nombre sin extensión
    
    const result = await uploadImage(imagePath, publicId);
    if (result) {
      results.push({
        original: file,
        publicId: publicId,
        url: result.secure_url,
        cloudinaryId: result.public_id
      });
    }
    
    // Pequeña pausa entre subidas
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Guardar resultados en un archivo JSON
  const resultsPath = path.join(__dirname, '../cloudinary-images.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  
  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Subidas exitosas: ${results.length}`);
  console.log(`   ❌ Errores: ${imageFiles.length - results.length}`);
  console.log(`   📄 Resultados guardados en: cloudinary-images.json`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  uploadAllImages().catch(console.error);
}

module.exports = { uploadImage, uploadAllImages };
