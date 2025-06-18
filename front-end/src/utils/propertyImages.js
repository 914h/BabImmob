// Array of random property images from Unsplash
const propertyImages = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600566752547-0b4c8c4c4c4c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600566752547-0b4c8c4c4c4c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop'
];

// Property type specific images
const propertyTypeImages = {
  apartment: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1560448075-bb485b067938?w=400&h=300&fit=crop'
  ],
  house: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop'
  ],
  villa: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop'
  ]
};

/**
 * Get a random property image based on property type
 * @param {string} propertyType - The type of property (apartment, house, villa)
 * @param {number} propertyId - The property ID to ensure consistent image for same property
 * @returns {string} - URL of a random property image
 */
export const getRandomPropertyImage = (propertyType = null, propertyId = null) => {
  let imageArray = propertyImages; // Default to general property images
  
  // If property type is specified and we have type-specific images, use those
  if (propertyType && propertyTypeImages[propertyType]) {
    imageArray = propertyTypeImages[propertyType];
  }
  
  // If property ID is provided, use it to ensure consistent image for same property
  if (propertyId !== null) {
    const index = propertyId % imageArray.length;
    return imageArray[index];
  }
  
  // Otherwise return a truly random image
  const randomIndex = Math.floor(Math.random() * imageArray.length);
  return imageArray[randomIndex];
};

/**
 * Get property image with fallback to random image
 * @param {string} mainImage - The main image path from the property
 * @param {string} propertyType - The type of property
 * @param {number} propertyId - The property ID
 * @param {string} backendUrl - The backend URL for serving images
 * @returns {string} - URL of the property image or fallback
 */
export const getPropertyImage = (mainImage, propertyType = null, propertyId = null, backendUrl = 'http://localhost:8000') => {
  if (mainImage) {
    return `${backendUrl}/storage/${mainImage}`;
  }
  
  return getRandomPropertyImage(propertyType, propertyId);
}; 