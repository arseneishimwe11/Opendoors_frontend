export const imageService = {
  // Default fallback images for scholarships
  getDefaultScholarshipImage: (field_of_study?: string): string => {
    const defaults: Record<string, string> = {
      'Engineering': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop&auto=format',
      'Medicine': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop&auto=format', 
      'Business': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&auto=format',
      'Arts': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop&auto=format',
      'Science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop&auto=format',
      'Technology': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop&auto=format',
      'Education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop&auto=format',
    };
    return defaults[field_of_study as keyof typeof defaults] || 
           'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop&auto=format';
  },

  // Default fallback images for events
  getDefaultEventImage: (event_type?: string): string => {
    const defaults: Record<string, string> = {
      'Fellowship': 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=400&fit=crop&auto=format',
      'Competition': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&auto=format',
      'Training': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop&auto=format',
      'Conference': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop&auto=format',
      'Workshop': 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=800&h=400&fit=crop&auto=format',
      'Hackathon': 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=400&fit=crop&auto=format',
      'Bootcamp': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&auto=format',
      'Awards': 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&h=400&fit=crop&auto=format',
      'Grants': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop&auto=format',
    };
    return defaults[event_type as keyof typeof defaults] || 
           'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=400&fit=crop&auto=format';
  },

  // Image optimization helper
  getOptimizedImageUrl: (imagePath: string, width?: number, height?: number): string => {
    if (!imagePath) return '';
    
    // If it's already an Unsplash URL, just return it
    if (imagePath.includes('unsplash.com')) {
      return imagePath;
    }
    
    // For other image URLs, could integrate with services like Cloudinary
    // For now, just return the original URL
    return imagePath;
  },

  // Validate image URL
  isValidImageUrl: (url: string): boolean => {
    if (!url) return false;
    
    // Basic URL validation
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};
