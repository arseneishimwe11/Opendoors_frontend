import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Calendar as CalendarIcon, 
  Save,
  Loader2
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import type { Event } from '../../lib/apiClient';

interface SimpleAdminEventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
  onSuccess?: () => void;
}

export default function SimpleAdminEventForm({
  open,
  onOpenChange,
  event,
  onSuccess
}: SimpleAdminEventFormProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state matching the actual API interface
  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    location: '',
    description: '',
    requirements: '',
    link: '',
    banner_image: '',
    logo_image: '',
    image_alt: '',
    event_type: 'Conference',
    format: 'In-person',
    duration: '',
    start_date: '',
    end_date: '',
    deadline: '',
    benefits: '',
    eligibility: '',
    application_process: '',
    category: 'Technology',
    isActive: true,
    isFeatured: false,
  });

  // Reset form when modal opens/closes or event changes
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        organizer: event.organizer || '',
        location: event.location || '',
        description: event.description || '',
        requirements: event.requirements || '',
        link: event.link || '',
        banner_image: (event as any).banner_image || '',
        logo_image: (event as any).logo_image || '',
        image_alt: (event as any).image_alt || '',
        event_type: event.event_type || 'Conference',
        format: event.format || 'In-person',
        duration: event.duration || '',
        start_date: event.start_date || '',
        end_date: event.end_date || '',
        deadline: event.deadline || '',
        benefits: event.benefits || '',
        eligibility: event.eligibility || '',
        application_process: event.application_process || '',
        category: event.category || 'Technology',
        isActive: event.isActive ?? true,
        isFeatured: event.isFeatured ?? false,
      });
    } else {
      setFormData({
        title: '',
        organizer: '',
        location: '',
        description: '',
        requirements: '',
        link: '',
        banner_image: '',
        logo_image: '',
        image_alt: '',
        event_type: 'Conference',
        format: 'In-person',
        duration: '',
        start_date: '',
        end_date: '',
        deadline: '',
        benefits: '',
        eligibility: '',
        application_process: '',
        category: 'Technology',
        isActive: true,
        isFeatured: false,
      });
    }
    setError('');
  }, [event, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (event) {
        await apiClient.events.update(event.id, formData);
      } else {
        await apiClient.events.create(formData);
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const eventTypeOptions = [
    'Conference',
    'Workshop',
    'Seminar',
    'Training',
    'Bootcamp',
    'Hackathon',
    'Networking',
    'Webinar',
    'Competition',
    'Job Fair'
  ];

  const formatOptions = [
    'In-person',
    'Virtual',
    'Hybrid'
  ];

  const categoryOptions = [
    'Technology',
    'Business',
    'Education',
    'Health',
    'Agriculture',
    'Finance',
    'Arts',
    'Other'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'
      }`}>
        <DialogHeader>
          <DialogTitle className={`text-2xl font-bold flex items-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <CalendarIcon className="w-6 h-6 mr-2 text-purple-600" />
            {event ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
          <DialogDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            {event ? 'Update event details' : 'Create a new event or opportunity'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <Card className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Rwanda Tech Summit 2024"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizer">Organizer *</Label>
                  <Input
                    id="organizer"
                    value={formData.organizer}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                    placeholder="e.g., Rwanda Development Board"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Kigali, Rwanda"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the event..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Event/Registration Link</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="banner_image">Banner Image</Label>
                  <Input
                    id="banner_image"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        setFormData(prev => ({ ...prev, banner_image: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  {formData.banner_image && (
                    <img src={formData.banner_image} alt={formData.image_alt || 'Banner preview'} className="mt-2 h-24 w-full object-cover rounded" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo_image">Logo Image</Label>
                  <Input
                    id="logo_image"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        setFormData(prev => ({ ...prev, logo_image: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  {formData.logo_image && (
                    <img src={formData.logo_image} alt={formData.image_alt || 'Logo preview'} className="mt-2 h-24 w-24 object-cover rounded" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_alt">Image Alt Text</Label>
                <Input
                  id="image_alt"
                  value={formData.image_alt}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_alt: e.target.value }))}
                  placeholder="Describe the image for accessibility"
                />
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}>
            <CardHeader>
              <CardTitle className="text-lg">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_type">Event Type</Label>
                  <Select value={formData.event_type} onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypeOptions.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Select value={formData.format} onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map(format => (
                        <SelectItem key={format} value={format}>{format}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Registration Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 3 days, 2 hours"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="Prerequisites, equipment needed, etc..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                  placeholder="What benefits does attending provide..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="application_process">Application Process</Label>
                <Textarea
                  id="application_process"
                  value={formData.application_process}
                  onChange={(e) => setFormData(prev => ({ ...prev, application_process: e.target.value }))}
                  placeholder="How to apply or register..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this event visible to users
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured</Label>
                  <p className="text-sm text-muted-foreground">
                    Mark as featured event
                  </p>
                </div>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {event ? 'Update Event' : 'Create Event'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
