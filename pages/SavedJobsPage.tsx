import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ExternalLink, Calendar, MapPin, Building, BookOpen, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '../contexts/ThemeContext';
import { apiClient } from '../lib/apiClient';
import type { Job, Scholarship, Event } from '../lib/apiClient';
import JobCard from '../components/JobCard';
import ScholarshipCard from '../components/scholarships/ScholarshipCard';
import EventCard from '../components/events/EventCard';

export default function SavedJobsPage() {
  const { theme } = useTheme();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<Scholarship[]>([]);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');

  // Load saved items from localStorage and fetch full data
  useEffect(() => {
    const loadSavedItems = async () => {
      try {
        // Get saved IDs from localStorage
        const savedJobIds = JSON.parse(localStorage.getItem('savedJobIds') || '[]');
        const savedScholarshipIds = JSON.parse(localStorage.getItem('savedScholarshipIds') || '[]');
        const savedEventIds = JSON.parse(localStorage.getItem('savedEventIds') || '[]');

        // Fetch full data for saved items
        const [jobsResponse, scholarshipsResponse, eventsResponse] = await Promise.all([
          savedJobIds.length > 0 ? apiClient.jobs.list().catch(() => ({ jobs: [] })) : Promise.resolve({ jobs: [] }),
          savedScholarshipIds.length > 0 ? apiClient.scholarships.list().catch(() => ({ scholarships: [] })) : Promise.resolve({ scholarships: [] }),
          savedEventIds.length > 0 ? apiClient.events.list().catch(() => ({ events: [] })) : Promise.resolve({ events: [] }),
        ]);
        
        // Filter to only saved items
        const jobs = (jobsResponse as any)?.jobs?.filter((job: Job) => savedJobIds.includes(job.id)) || [];
        const scholarships = (scholarshipsResponse as any)?.scholarships?.filter((scholarship: Scholarship) => savedScholarshipIds.includes(scholarship.id)) || [];
        const events = (eventsResponse as any)?.events?.filter((event: Event) => savedEventIds.includes(event.id)) || [];
        
        setSavedJobs(jobs);
        setSavedScholarships(scholarships);
        setSavedEvents(events);
      } catch (error) {
        console.error('Error loading saved items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedItems();
  }, []);

  const totalSavedItems = savedJobs.length + savedScholarships.length + savedEvents.length;

  if (loading) {
    return (
      <div className={`min-h-screen pt-16 flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' 
          : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-white'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Loading saved items...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen pt-16 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-white'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 mr-4 text-red-500" />
            <h1 className={`text-4xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Saved Items
            </h1>
          </div>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Keep track of opportunities you're interested in
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Content */}
        {!loading && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full grid-cols-3 mb-8 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <TabsTrigger 
                value="jobs" 
                className="flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                Jobs ({savedJobs.length})
              </TabsTrigger>
              <TabsTrigger 
                value="scholarships" 
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Scholarships ({savedScholarships.length})
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Events ({savedEvents.length})
              </TabsTrigger>
            </TabsList>

            {/* Jobs Tab */}
            <TabsContent value="jobs">
              {savedJobs.length === 0 ? (
                <Card className={`p-12 text-center ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80'
                }`}>
                  <Briefcase className={`w-16 h-16 mx-auto mb-4 opacity-50 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <h3 className={`text-xl font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    No saved jobs yet
                  </h3>
                  <p className={`mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Start browsing jobs and save the ones you're interested in
                  </p>
                  <Button onClick={() => window.location.href = '/jobs'}>
                    Browse Jobs
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Scholarships Tab */}
            <TabsContent value="scholarships">
              {savedScholarships.length === 0 ? (
                <Card className={`p-12 text-center ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80'
                }`}>
                  <BookOpen className={`w-16 h-16 mx-auto mb-4 opacity-50 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <h3 className={`text-xl font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    No saved scholarships yet
                  </h3>
                  <p className={`mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Start browsing scholarships and save the ones you're interested in
                  </p>
                  <Button onClick={() => window.location.href = '/scholarships'}>
                    Browse Scholarships
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedScholarships.map((scholarship) => (
                    <ScholarshipCard
                      key={scholarship.id}
                      scholarship={scholarship}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              {savedEvents.length === 0 ? (
                <Card className={`p-12 text-center ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80'
                }`}>
                  <Calendar className={`w-16 h-16 mx-auto mb-4 opacity-50 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <h3 className={`text-xl font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    No saved events yet
                  </h3>
                  <p className={`mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Start browsing events and save the ones you're interested in
                  </p>
                  <Button onClick={() => window.location.href = '/events'}>
                    Browse Events
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
