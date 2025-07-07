// Array of fallback images for different categories
const fallbackImages = {
  general: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  business: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  technology: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  entertainment: "https://images.unsplash.com/photo-1489599830792-4e8d5f9c8b8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  health: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  science: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  politics: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  default: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
};

// Function to get appropriate fallback image based on category
export const getFallbackImage = (category = 'general') => {
  return fallbackImages[category.toLowerCase()] || fallbackImages.default;
};

// Function to validate image URL
export const isValidImageUrl = (url) => {
  if (!url) return false;
  
  // Check if it's a valid URL
  try {
    new URL(url);
  } catch {
    return false;
  }
  
  // Check if it's an image URL
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
         lowerUrl.includes('unsplash.com') || 
         lowerUrl.includes('pexels.com') ||
         lowerUrl.includes('pixabay.com');
};

// Function to handle image error with multiple fallbacks
export const handleImageError = (event, category = 'general') => {
  const img = event.target;
  
  // If this is already a fallback image, don't try again
  if (img.src.includes('unsplash.com')) {
    img.src = fallbackImages.default;
    return;
  }
  
  // Try category-specific fallback first
  img.src = getFallbackImage(category);
}; 