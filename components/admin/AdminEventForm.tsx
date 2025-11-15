import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { apiClient } from '../../lib/apiClient';
import type { Event as EventType } from '../../lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Users, Save, Loader2 } from 'lucide-react';

interface AdminEventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: EventType | null;
  onSuccess?: () => void;
}

interface EventFormState {
  title: string;
  organizer: string;
  description: string;
  eventType: string;
  format: string;
  location: string;
  venue: string;
  startDate?: Date;
  endDate?: Date;
  registrationUrl: string;
  registrationDeadline?: Date;
  capacity: string;
  fee: string;
  currency: string;
  targetAudience: string;
  requirements: string;
  isActive: boolean;
  tags: string[];
}

export default function AdminEventForm({
  open,
  onOpenChange,
  event,
  onSuccess
}: AdminEventFormProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [deadlineOpen, setDeadlineOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<EventFormState>({
    title: '',
    organizer: '',
    description: '',
    eventType: 'Conference',
    format: 'In-person',
    location: '',
    venue: '',
    startDate: undefined,
    endDate: undefined,
    registrationUrl: '',
    registrationDeadline: undefined,
    capacity: '',
    fee: '',
    currency: 'RWF',
    targetAudience: '',
    requirements: '',
    isActive: true,
    tags: [] as string[],
  });

  // Reset form when modal opens/closes or event changes
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        organizer: event.organizer || '',
        description: event.description || '',
        eventType: event.event_type || 'Conference',
        format: event.format || 'In-person',
        location: event.location || '',
        venue: '',
        startDate: event.start_date ? new Date(event.start_date) : undefined,
        endDate: event.end_date ? new Date(event.end_date) : undefined,
        registrationUrl: event.link || '',
        registrationDeadline: event.deadline ? new Date(event.deadline) : undefined,
        capacity: '',
        fee: '',
        currency: 'RWF',
        targetAudience: '',
        requirements: event.requirements || '',
        isActive: event.isActive ?? true,
        tags: [],
      });
    } else {
      setFormData({
        title: '',
        organizer: '',
        description: '',
        eventType: 'Conference',
        format: 'In-person',
        location: '',
        venue: '',
        startDate: undefined,
        endDate: undefined,
        registrationUrl: '',
        registrationDeadline: undefined,
        capacity: '',
        fee: '',
        currency: 'RWF',
        targetAudience: '',
        requirements: '',
        isActive: true,
        tags: [],
      });
    }
    setError('');
  }, [event, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const eventData = {
        title: formData.title,
        organizer: formData.organizer,
        location: formData.location,
        description: formData.description || undefined,
        requirements: formData.requirements || undefined,
        link: formData.registrationUrl || undefined,
        event_type: formData.eventType,
        format: formData.format || undefined,
        // Optional fields
        start_date: formData.startDate ? formData.startDate.toISOString() : undefined,
        end_date: formData.endDate ? formData.endDate.toISOString() : undefined,
        deadline: formData.registrationDeadline ? formData.registrationDeadline.toISOString() : undefined,
      };

      if (event) {
        await apiClient.events.update(event.id, eventData);
      } else {
        await apiClient.events.create(eventData);
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
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
    'Job Fair',
    'Other'
  ];

  const formatOptions = [
    'In-person',
    'Virtual',
    'Hybrid'
  ];

  const currencyOptions = [
    'RWF', 'USD', 'EUR', 'GBP', 'CAD', 'AUD'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${
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
              <CardTitle className="flex items-center text-lg">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select value={formData.eventType} onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}>
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
              </div>
            </CardContent>
          </Card>

          {/* Location & Dates */}
          <Card className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2" />
                Location & Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                    placeholder="e.g., Kigali Convention Centre"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !formData.startDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => {
                          setFormData(prev => ({ ...prev, startDate: date }));
                          setStartDateOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !formData.endDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : "Pick end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => {
                          setFormData(prev => ({ ...prev, endDate: date }));
                          setEndDateOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration & Details */}
          <Card className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="w-5 h-5 mr-2" />
                Registration & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="registrationUrl">Registration URL</Label>
                <Input
                  id="registrationUrl"
                  type="url"
                  value={formData.registrationUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, registrationUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Registration Deadline</Label>
                <Popover open={deadlineOpen} onOpenChange={setDeadlineOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !formData.registrationDeadline && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.registrationDeadline ? format(formData.registrationDeadline, "PPP") : "Pick deadline"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.registrationDeadline}
                      onSelect={(date) => {
                        setFormData(prev => ({ ...prev, registrationDeadline: date }));
                        setDeadlineOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    placeholder="e.g., 500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fee">Fee</Label>
                  <Input
                    id="fee"
                    value={formData.fee}
                    onChange={(e) => setFormData(prev => ({ ...prev, fee: e.target.value }))}
                    placeholder="e.g., 50000 or Free"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map(currency => (
                        <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="e.g., Students, Professionals, Entrepreneurs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="Prerequisites, equipment needed, etc..."
                  className="min-h-[80px]"
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
                  onCheckedChange={(checked: boolean) =>
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }
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
