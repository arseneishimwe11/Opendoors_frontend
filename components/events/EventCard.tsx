import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Heart, ExternalLink, Award, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '../../contexts/ThemeContext';
import { imageService } from '../../lib/imageService';
import { Event } from '../../lib/apiClient';
import EventModal from './EventModal';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Check if event is saved in localStorage
  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem('savedEventIds') || '[]');
    setIsSaved(savedIds.includes(event.id));
  }, [event.id]);

  // Image handling with fallbacks
  const bannerImage = event.banner_image || 
    imageService.getDefaultEventImage(event.event_type);
  
  const logoImage = event.logo_image;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const savedIds = JSON.parse(localStorage.getItem('savedEventIds') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const newIds = savedIds.filter((id: number) => id !== event.id);
      localStorage.setItem('savedEventIds', JSON.stringify(newIds));
      setIsSaved(false);
    } else {
      // Add to saved
      const newIds = [...savedIds, event.id];
      localStorage.setItem('savedEventIds', JSON.stringify(newIds));
      setIsSaved(true);
    }
  };

  // Event type colors
  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Fellowship': 'bg-purple-600',
      'Competition': 'bg-red-600',
      'Training': 'bg-blue-600',
      'Conference': 'bg-green-600',
      'Workshop': 'bg-orange-600',
      'Bootcamp': 'bg-indigo-600',
      'Summit': 'bg-teal-600',
      'Hackathon': 'bg-pink-600',
      'Awards': 'bg-yellow-600',
      'Grants': 'bg-emerald-600',
      'Accelerator': 'bg-violet-600',
      'Incubator': 'bg-cyan-600',
      'Mentorship': 'bg-rose-600',
      'Volunteering': 'bg-lime-600',
      'Leadership Program': 'bg-amber-600',
    };
    return colors[type] || 'bg-gray-600';
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
            alt={event.image_alt || `${event.title} banner`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = imageService.getDefaultEventImage(event.event_type);
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Featured Badge */}
          {event.isFeatured && (
            <Badge className="absolute top-3 left-3 bg-yellow-500 text-black font-semibold">
              Featured
            </Badge>
          )}
          
          {/* Event Type Badge */}
          <Badge className={`absolute top-3 right-3 ${getEventTypeColor(event.event_type)} text-white`}>
            {event.event_type}
          </Badge>
          
          {/* Format Badge (if available) */}
          {event.format && (
            <Badge className="absolute bottom-14 right-3 bg-blue-600 text-white text-xs">
              {event.format}
            </Badge>
          )}

          {/* Organization Logo (if available) */}
          {logoImage && (
            <div className="absolute bottom-3 right-3 w-12 h-12 rounded-lg overflow-hidden bg-white/90 p-1">
              <img 
                src={logoImage}
                alt={`${event.organizer} logo`}
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

          {/* Date Overlay (if available) */}
          {event.start_date && (
            <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{event.start_date}</span>
            </div>
          )}
        </div>
        
        {/* Content Area */}
        <div className="p-4" onClick={() => setIsModalOpen(true)}>
          {/* Title & Organizer */}
          <div className="mb-3">
            <h3 className={`font-semibold text-lg leading-tight mb-1 line-clamp-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {event.title}
            </h3>
            <p className={`text-sm font-medium ${
              theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
            }`}>
              {event.organizer}
            </p>
          </div>
          
          {/* Metadata */}
          <div className="flex flex-wrap gap-2 mb-3">
            <div className={`flex items-center gap-1 text-xs ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <MapPin className="w-3 h-3" />
              <span>{event.location}</span>
            </div>
            
            {event.duration && (
              <div className={`flex items-center gap-1 text-xs ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <Clock className="w-3 h-3" />
                <span>{event.duration}</span>
              </div>
            )}
            
            {event.deadline && (
              <div className="flex items-center gap-1 text-xs text-red-500">
                <Clock className="w-3 h-3" />
                <span>Apply by: {event.deadline}</span>
              </div>
            )}
          </div>
          
          {/* Benefits Preview */}
          {event.benefits && (
            <div className={`text-sm font-medium mb-3 flex items-center gap-1 ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              <Award className="w-3 h-3" />
              <span className="line-clamp-1">{event.benefits}</span>
            </div>
          )}
          
          {/* Description Preview */}
          {event.description && (
            <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {event.description}
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
            
            {event.link && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(event.link, '_blank');
                }}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <EventModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
