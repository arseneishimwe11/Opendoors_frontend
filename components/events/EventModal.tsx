import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Heart, 
  ExternalLink, 
  Award,
  Building,
  Users,
  Settings,
  X
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { imageService } from '../../lib/imageService';
import { Event } from '../../lib/apiClient';

interface EventModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventModal({ 
  event, 
  isOpen, 
  onClose
}: EventModalProps) {
  const { theme } = useTheme();
  const [isSaved, setIsSaved] = useState(false);

  // Check if event is saved in localStorage
  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem('savedEventIds') || '[]');
    setIsSaved(savedIds.includes(event.id));
  }, [event.id]);

  const bannerImage = event.banner_image || 
    imageService.getDefaultEventImage(event.event_type);

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

  const handleSave = () => {
    const savedIds = JSON.parse(localStorage.getItem('savedEventIds') || '[]');
    
    if (isSaved) {
      const newIds = savedIds.filter((id: number) => id !== event.id);
      localStorage.setItem('savedEventIds', JSON.stringify(newIds));
      setIsSaved(false);
    } else {
      const newIds = [...savedIds, event.id];
      localStorage.setItem('savedEventIds', JSON.stringify(newIds));
      setIsSaved(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${
        theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white'
      }`}>
        <DialogClose className="absolute right-4 top-4 z-10">
          <X className="h-4 w-4" />
        </DialogClose>

        {/* Header Image */}
        <div className="relative h-64 -m-6 mb-0 rounded-t-lg overflow-hidden">
          <img 
            src={bannerImage}
            alt={event.image_alt || `${event.title} banner`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = imageService.getDefaultEventImage(event.event_type);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Featured Badge */}
          {event.isFeatured && (
            <Badge className="absolute top-4 left-4 bg-yellow-500 text-black font-semibold">
              Featured
            </Badge>
          )}
          
          {/* Event Type Badge */}
          <Badge className={`absolute top-4 right-4 ${getEventTypeColor(event.event_type)} text-white`}>
            {event.event_type}
          </Badge>

          {/* Format Badge */}
          {event.format && (
            <Badge className="absolute top-16 right-4 bg-blue-600 text-white">
              {event.format}
            </Badge>
          )}
        </div>

        <div className="p-6 pt-4">
          {/* Header */}
          <DialogHeader className="mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {event.title}
                </DialogTitle>
                
                <div className="flex items-center gap-2 mb-4">
                  <Building className="w-4 h-4 text-purple-500" />
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
                  }`}>
                    {event.organizer}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSave}
                  className={isSaved ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </Button>
                
                {event.link && (
                  <Button
                    onClick={() => window.open(event.link, '_blank')}
                    className={`${getEventTypeColor(event.event_type)} hover:opacity-90 text-white`}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Join Event
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Location</span>
              </div>
              <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                {event.location}
              </p>
            </div>

            {event.duration && (
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Duration</span>
                </div>
                <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {event.duration}
                </p>
              </div>
            )}

            {event.deadline && (
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">Deadline</span>
                </div>
                <p className="text-red-600 font-medium">
                  {event.deadline}
                </p>
              </div>
            )}
          </div>

          {/* Event Dates & Benefits */}
          <div className="flex flex-wrap gap-3 mb-6">
            {event.start_date && (
              <Badge variant="outline" className="px-3 py-1">
                <Calendar className="w-3 h-3 mr-1" />
                Starts: {event.start_date}
              </Badge>
            )}
            
            {event.end_date && (
              <Badge variant="outline" className="px-3 py-1">
                <Calendar className="w-3 h-3 mr-1" />
                Ends: {event.end_date}
              </Badge>
            )}

            {event.benefits && (
              <Badge className="bg-green-600 text-white px-3 py-1">
                <Award className="w-3 h-3 mr-1" />
                {event.benefits}
              </Badge>
            )}
          </div>

          <Separator className="my-6" />

          {/* Description */}
          {event.description && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                About This Event
              </h3>
              <div className={`prose max-w-none ${
                theme === 'dark' ? 'prose-invert' : ''
              }`}>
                <p className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {event.description}
                </p>
              </div>
            </div>
          )}

          {/* Requirements */}
          {event.requirements && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Requirements
              </h3>
              <div className={`prose max-w-none ${
                theme === 'dark' ? 'prose-invert' : ''
              }`}>
                <p className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {event.requirements}
                </p>
              </div>
            </div>
          )}

          {/* Eligibility */}
          {event.eligibility && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Eligibility
              </h3>
              <div className={`prose max-w-none ${
                theme === 'dark' ? 'prose-invert' : ''
              }`}>
                <p className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {event.eligibility}
                </p>
              </div>
            </div>
          )}

          {/* Application Process */}
          {event.application_process && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                How to Apply
              </h3>
              <div className={`prose max-w-none ${
                theme === 'dark' ? 'prose-invert' : ''
              }`}>
                <p className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {event.application_process}
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            
            {event.link && (
              <Button
                onClick={() => window.open(event.link, '_blank')}
                className={`${getEventTypeColor(event.event_type)} hover:opacity-90 text-white flex-1`}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Register for This Event
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
