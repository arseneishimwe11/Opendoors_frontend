import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, BookOpen, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { apiClient, Scholarship } from '../lib/apiClient';
import ScholarshipCard from '../components/scholarships/ScholarshipCard';

export default function ScholarshipsPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDegreeLevel, setSelectedDegreeLevel] = useState('');
  const [selectedFundingType, setSelectedFundingType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Build query parameters
  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      limit: 12,
    };
    
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (selectedDegreeLevel) params.degree_level = selectedDegreeLevel;
    if (selectedFundingType) params.funding_type = selectedFundingType;
    if (selectedLocation) params.location = selectedLocation;
    if (featuredOnly) params.featured = true;
    
    return params;
  }, [searchTerm, selectedDegreeLevel, selectedFundingType, selectedLocation, featuredOnly, currentPage]);

  // Fetch scholarships
  const {
    data: scholarshipsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['scholarships', queryParams],
    queryFn: () => apiClient.scholarships.list(queryParams),
  });

  // Handle save/unsave scholarship
  const handleSaveScholarship = async (scholarshipId: number) => {
    if (!user) return;
    
    try {
      await apiClient.savedScholarships.save({ scholarshipId, userId: user.id });
      refetch();
    } catch (error) {
      console.error('Failed to save scholarship:', error);
    }
  };

  const handleUnsaveScholarship = async (scholarshipId: number) => {
    if (!user) return;
    
    try {
      await apiClient.savedScholarships.unsave({ scholarshipId, userId: user.id });
      refetch();
    } catch (error) {
      console.error('Failed to unsave scholarship:', error);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDegreeLevel('');
    setSelectedFundingType('');
    setSelectedLocation('');
    setFeaturedOnly(false);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || selectedDegreeLevel || selectedFundingType || selectedLocation || featuredOnly;

  // Filter options
  const degreeLevels = ['Undergraduate', 'Masters', 'PhD', 'Postdoctoral', 'All Levels'];
  const fundingTypes = ['Full', 'Partial', 'Tuition Only', 'Living Expenses', 'Research Grant'];
  const locations = ['Global', 'United States', 'United Kingdom', 'Canada', 'Europe', 'Asia', 'Africa', 'Australia'];

  return (
    <div className={`min-h-screen pt-16 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-white'
    }`}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className={`w-12 h-12 mr-4 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <h1 className={`text-4xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Scholarships
            </h1>
          </div>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Discover funding opportunities for your educational journey. 
            Find scholarships that match your field of study and career goals.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className={`mb-8 ${
          theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 backdrop-blur-sm'
        }`}>
          <CardContent className="p-6">
            {/* Search Bar */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search scholarships by title, organization, or field..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                <Select value={selectedDegreeLevel} onValueChange={setSelectedDegreeLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Degree Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {degreeLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedFundingType} onValueChange={setSelectedFundingType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Funding Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fundingTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant={featuredOnly ? "default" : "outline"}
                  onClick={() => setFeaturedOnly(!featuredOnly)}
                  className="justify-start"
                >
                  Featured Only
                </Button>
              </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchTerm}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSearchTerm('')}
                    />
                  </Badge>
                )}
                {selectedDegreeLevel && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Level: {selectedDegreeLevel}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedDegreeLevel('')}
                    />
                  </Badge>
                )}
                {selectedFundingType && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Funding: {selectedFundingType}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedFundingType('')}
                    />
                  </Badge>
                )}
                {selectedLocation && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Location: {selectedLocation}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedLocation('')}
                    />
                  </Badge>
                )}
                {featuredOnly && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Featured Only
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setFeaturedOnly(false)}
                    />
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {scholarshipsData && (
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Showing {scholarshipsData.scholarships.length} of {scholarshipsData.pagination.total} scholarships
                {currentPage > 1 && ` (Page ${currentPage})`}
              </p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className={`overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'
              }`}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className={`p-8 text-center ${
            theme === 'dark' ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
          }`}>
            <p className="text-red-600 mb-4">Failed to load scholarships</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </Card>
        )}

        {/* Scholarships Grid */}
        {scholarshipsData && scholarshipsData.scholarships.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {scholarshipsData.scholarships.map((scholarship: Scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                />
              ))}
            </div>

            {/* Pagination */}
            {scholarshipsData.pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: scholarshipsData.pagination.totalPages }, (_, i) => i + 1)
                    .slice(
                      Math.max(0, currentPage - 3),
                      Math.min(scholarshipsData.pagination.totalPages, currentPage + 2)
                    )
                    .map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                </div>
                
                <Button
                  variant="outline"
                  disabled={currentPage === scholarshipsData.pagination.totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {scholarshipsData && scholarshipsData.scholarships.length === 0 && (
          <Card className={`p-12 text-center ${
            theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80'
          }`}>
            <BookOpen className={`w-16 h-16 mx-auto mb-4 opacity-50 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No scholarships found
            </h3>
            <p className={`mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Try adjusting your search criteria or filters
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
