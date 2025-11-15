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
  GraduationCap,
  Save,
  Loader2
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import type { Scholarship } from '../../lib/apiClient';

interface SimpleAdminScholarshipFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholarship?: Scholarship | null;
  onSuccess?: () => void;
}

export default function SimpleAdminScholarshipForm({
  open,
  onOpenChange,
  scholarship,
  onSuccess
}: SimpleAdminScholarshipFormProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state matching the actual API interface
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    location: '',
    description: '',
    requirements: '',
    link: '',
    banner_image: '',
    logo_image: '',
    image_alt: '',
    degree_level: 'Undergraduate',
    field_of_study: '',
    funding_type: 'Full',
    funding_amount: '',
    deadline: '',
    duration: '',
    eligibility: '',
    benefits: '',
    category: 'Education',
    isActive: true,
    isFeatured: false,
  });

  // Reset form when modal opens/closes or scholarship changes
  useEffect(() => {
    if (scholarship) {
      setFormData({
        title: scholarship.title || '',
        organization: scholarship.organization || '',
        location: scholarship.location || '',
        description: scholarship.description || '',
        requirements: scholarship.requirements || '',
        link: scholarship.link || '',
        banner_image: (scholarship as any).banner_image || '',
        logo_image: (scholarship as any).logo_image || '',
        image_alt: (scholarship as any).image_alt || '',
        degree_level: scholarship.degree_level || 'Undergraduate',
        field_of_study: scholarship.field_of_study || '',
        funding_type: scholarship.funding_type || 'Full',
        funding_amount: scholarship.funding_amount || '',
        deadline: scholarship.deadline || '',
        duration: scholarship.duration || '',
        eligibility: scholarship.eligibility || '',
        benefits: scholarship.benefits || '',
        category: scholarship.category || 'Education',
        isActive: scholarship.isActive ?? true,
        isFeatured: scholarship.isFeatured ?? false,
      });
    } else {
      setFormData({
        title: '',
        organization: '',
        location: '',
        description: '',
        requirements: '',
        link: '',
        banner_image: '',
        logo_image: '',
        image_alt: '',
        degree_level: 'Undergraduate',
        field_of_study: '',
        funding_type: 'Full',
        funding_amount: '',
        deadline: '',
        duration: '',
        eligibility: '',
        benefits: '',
        category: 'Education',
        isActive: true,
        isFeatured: false,
      });
    }
    setError('');
  }, [scholarship, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (scholarship) {
        await apiClient.scholarships.update(scholarship.id, formData);
      } else {
        await apiClient.scholarships.create(formData);
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save scholarship');
    } finally {
      setLoading(false);
    }
  };

  const degreeOptions = [
    'Undergraduate',
    'Masters',
    'PhD',
    'Postdoctoral',
    'All Levels'
  ];

  const fundingOptions = [
    'Full',
    'Partial',
    'Tuition Only',
    'Living Expenses',
    'Research Grant'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'
        }`}>
        <DialogHeader>
          <DialogTitle className={`text-2xl font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
            <GraduationCap className="w-6 h-6 mr-2 text-blue-600" />
            {scholarship ? 'Edit Scholarship' : 'Add New Scholarship'}
          </DialogTitle>
          <DialogDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            {scholarship ? 'Update scholarship details' : 'Create a new scholarship opportunity'}
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
                  <Label htmlFor="title">Scholarship Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Rwanda Excellence Scholarship"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization *</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="e.g., University of Rwanda"
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
                  placeholder="Detailed description of the scholarship program..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Application Link</Label>
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
                {/* <div className="space-y-2">
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
                </div> */}
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

          {/* Academic & Funding Details */}
          <Card className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}>
            <CardHeader>
              <CardTitle className="text-lg">Academic & Funding Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree_level">Degree Level</Label>
                  <Select value={formData.degree_level} onValueChange={(value) => setFormData(prev => ({ ...prev, degree_level: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {degreeOptions.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field_of_study">Field of Study</Label>
                  <Input
                    id="field_of_study"
                    value={formData.field_of_study}
                    onChange={(e) => setFormData(prev => ({ ...prev, field_of_study: e.target.value }))}
                    placeholder="e.g., Engineering, Medicine"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="funding_type">Funding Type</Label>
                  <Select value={formData.funding_type} onValueChange={(value) => setFormData(prev => ({ ...prev, funding_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fundingOptions.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="funding_amount">Funding Amount</Label>
                  <Input
                    id="funding_amount"
                    value={formData.funding_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, funding_amount: e.target.value }))}
                    placeholder="e.g., $50,000 or Full tuition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 4 years, 2 semesters"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="Eligibility requirements, academic criteria, etc..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                  placeholder="What benefits does this scholarship provide..."
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
                    Make this scholarship visible to users
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
                    Mark as featured scholarship
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {scholarship ? 'Update Scholarship' : 'Create Scholarship'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
