import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  GraduationCap, 
  Clock, 
  Heart, 
  ExternalLink, 
  DollarSign,
  Building,
  Calendar,
  Users,
  X
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { imageService } from '../../lib/imageService';
import { Scholarship } from '../../lib/apiClient';

interface ScholarshipModalProps {
  scholarship: Scholarship;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (scholarshipId: number) => void;
  onUnsave?: (scholarshipId: number) => void;
}

export default function ScholarshipModal({ 
  scholarship, 
  isOpen, 
  onClose, 
  onSave, 
  onUnsave 
}: ScholarshipModalProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(scholarship.is_saved || false);
  const [isLoading, setIsLoading] = useState(false);

  const bannerImage = scholarship.banner_image || 
    imageService.getDefaultScholarshipImage(scholarship.field_of_study);

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (isSaved) {
        await onUnsave?.(scholarship.id);
        setIsSaved(false);
      } else {
        await onSave?.(scholarship.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to toggle save status:', error);
    } finally {
      setIsLoading(false);
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
            alt={scholarship.image_alt || `${scholarship.title} banner`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = imageService.getDefaultScholarshipImage(scholarship.field_of_study);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Featured Badge */}
          {scholarship.isFeatured && (
            <Badge className="absolute top-4 left-4 bg-yellow-500 text-black font-semibold">
              Featured
            </Badge>
          )}
          
          {/* Funding Type Badge */}
          <Badge className="absolute top-4 right-4 bg-green-600 text-white">
            {scholarship.funding_type}
          </Badge>
        </div>

        <div className="p-6 pt-4">
          {/* Header */}
          <DialogHeader className="mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {scholarship.title}
                </DialogTitle>
                
                <div className="flex items-center gap-2 mb-4">
                  <Building className="w-4 h-4 text-blue-500" />
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    {scholarship.organization}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                {user && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSave}
                    disabled={isLoading}
                    className={isSaved ? 'text-red-500 border-red-500' : ''}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </Button>
                )}
                
                {scholarship.link && (
                  <Button
                    onClick={() => window.open(scholarship.link, '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Apply Now
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
                {scholarship.location}
              </p>
            </div>

            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Degree Level</span>
              </div>
              <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                {scholarship.degree_level}
              </p>
            </div>

            {scholarship.deadline && (
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">Deadline</span>
                </div>
                <p className="text-red-600 font-medium">
                  {scholarship.deadline}
                </p>
              </div>
            )}
          </div>

          {/* Field of Study & Funding */}
          <div className="flex flex-wrap gap-3 mb-6">
            {scholarship.field_of_study && (
              <Badge variant="secondary" className="px-3 py-1">
                {scholarship.field_of_study}
              </Badge>
            )}
            
            {scholarship.funding_amount && (
              <Badge className="bg-green-600 text-white px-3 py-1">
                <DollarSign className="w-3 h-3 mr-1" />
                {scholarship.funding_amount}
              </Badge>
            )}

            {scholarship.duration && (
              <Badge variant="outline" className="px-3 py-1">
                <Calendar className="w-3 h-3 mr-1" />
                {scholarship.duration}
              </Badge>
            )}
          </div>

          <Separator className="my-6" />

          {/* Description */}
          {scholarship.description && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                About This Scholarship
              </h3>
              <div className={`prose max-w-none ${
                theme === 'dark' ? 'prose-invert' : ''
              }`}>
                <p className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {scholarship.description}
                </p>
              </div>
            </div>
          )}

          {/* Requirements */}
          {scholarship.requirements && (
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
                  {scholarship.requirements}
                </p>
              </div>
            </div>
          )}

          {/* Eligibility */}
          {scholarship.eligibility && (
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
                  {scholarship.eligibility}
                </p>
              </div>
            </div>
          )}

          {/* Benefits */}
          {scholarship.benefits && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Benefits
              </h3>
              <div className={`prose max-w-none ${
                theme === 'dark' ? 'prose-invert' : ''
              }`}>
                <p className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {scholarship.benefits}
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            
            {scholarship.link && (
              <Button
                onClick={() => window.open(scholarship.link, '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Apply for This Scholarship
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
