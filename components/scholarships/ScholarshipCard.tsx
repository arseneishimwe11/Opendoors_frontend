import React, { useState, useEffect } from 'react';
import { MapPin, GraduationCap, Clock, Heart, ExternalLink, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '../../contexts/ThemeContext';
import { imageService } from '../../lib/imageService';
import { Scholarship } from '../../lib/apiClient';
import ScholarshipModal from './ScholarshipModal';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export default function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Check if scholarship is saved in localStorage
  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem('savedScholarshipIds') || '[]');
    setIsSaved(savedIds.includes(scholarship.id));
  }, [scholarship.id]);

  // Image handling with fallbacks
  const bannerImage = scholarship.banner_image || 
    imageService.getDefaultScholarshipImage(scholarship.field_of_study);
  
  const logoImage = scholarship.logo_image;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const savedIds = JSON.parse(localStorage.getItem('savedScholarshipIds') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const newIds = savedIds.filter((id: number) => id !== scholarship.id);
      localStorage.setItem('savedScholarshipIds', JSON.stringify(newIds));
      setIsSaved(false);
    } else {
      // Add to saved
      const newIds = [...savedIds, scholarship.id];
      localStorage.setItem('savedScholarshipIds', JSON.stringify(newIds));
      setIsSaved(true);
    }
  };

  return (
    <>
      <div className={`relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-2xl group cursor-pointer ${
        theme === 'dark' 
          ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70' 
          : 'bg-white border border-gray-200/60 shadow-sm hover:shadow-lg'
      }`}>
        
        {/* Banner Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={bannerImage}
            alt={scholarship.image_alt || `${scholarship.title} banner`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = imageService.getDefaultScholarshipImage(scholarship.field_of_study);
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Featured Badge */}
          {scholarship.isFeatured && (
            <Badge className="absolute top-3 left-3 bg-yellow-500 text-black font-semibold">
              Featured
            </Badge>
          )}
          
          {/* Funding Type Badge */}
          <Badge className="absolute top-3 right-3 bg-green-600 text-white">
            {scholarship.funding_type}
          </Badge>
          
          {/* Organization Logo (if available) */}
          {logoImage && (
            <div className="absolute bottom-3 right-3 w-12 h-12 rounded-lg overflow-hidden bg-white/90 p-1">
              <img 
                src={logoImage}
                alt={`${scholarship.organization} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Save Button Overlay */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className={`absolute top-3 left-1/2 transform -translate-x-1/2 ${
              isSaved 
                ? 'text-red-500 bg-white/20 backdrop-blur-sm' 
                : 'text-white bg-black/20 backdrop-blur-sm hover:bg-white/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        {/* Content Area */}
        <div className="p-4" onClick={() => setIsModalOpen(true)}>
          {/* Title & Organization */}
          <div className="mb-3">
            <h3 className={`font-semibold text-lg leading-tight mb-1 line-clamp-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {scholarship.title}
            </h3>
            <p className={`text-sm font-medium ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
            }`}>
              {scholarship.organization}
            </p>
          </div>
          
          {/* Metadata */}
          <div className="flex flex-wrap gap-2 mb-3">
            <div className={`flex items-center gap-1 text-xs ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <MapPin className="w-3 h-3" />
              <span>{scholarship.location}</span>
            </div>
            <div className={`flex items-center gap-1 text-xs ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <GraduationCap className="w-3 h-3" />
              <span>{scholarship.degree_level}</span>
            </div>
            {scholarship.deadline && (
              <div className="flex items-center gap-1 text-xs text-red-500">
                <Clock className="w-3 h-3" />
                <span>Due: {scholarship.deadline}</span>
              </div>
            )}
          </div>
          
          {/* Field of Study */}
          {scholarship.field_of_study && (
            <div className="mb-3">
              <Badge variant="secondary" className="text-xs">
                {scholarship.field_of_study}
              </Badge>
            </div>
          )}
          
          {/* Funding Amount */}
          {scholarship.funding_amount && (
            <div className={`text-lg font-bold mb-3 flex items-center gap-1 ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              <DollarSign className="w-4 h-4" />
              <span>{scholarship.funding_amount}</span>
            </div>
          )}
          
          {/* Description Preview */}
          {scholarship.description && (
            <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {scholarship.description}
            </p>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              Learn More
            </Button>
            
            {scholarship.link && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(scholarship.link, '_blank');
                }}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ScholarshipModal
        scholarship={scholarship}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
