import React, { useState, useEffect } from 'react';
import { Container } from '../components/ui/Section';
import { interviewAPI } from '../services/api';
import { 
  Mic, Calendar, User, Video, Image, Play, X, ExternalLink, Eye, 
  CalendarDays, Link2, ChevronDown, ChevronUp, Users 
} from 'lucide-react';

const FALLBACK_IMAGE = 'https://placehold.co/600x400/1F3D2B/FFFFFF?text=Interview';

export function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      const { data } = await interviewAPI.getInterviews();
      setInterviews(data);
    } catch (error) {
      console.error('Failed to load interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getYear = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).getFullYear();
    } catch {
      return 'N/A';
    }
  };

  const hasImage = (item) => {
    return item.image && item.image !== '' && item.image !== null && item.image !== undefined;
  };

  const getThumbnail = (item) => {
    if (hasImage(item)) {
      return item.image;
    }
    if (item.type === 'video' && item.videoUrl) {
      const videoId = extractYouTubeId(item.videoUrl);
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
    return FALLBACK_IMAGE;
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const openVideo = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Get unique years for filter
  const years = [...new Set(interviews.map(item => getYear(item.date)))].filter(y => y !== 'N/A').sort((a, b) => b - a);

  const filteredInterviews = activeFilter === 'all' 
    ? interviews 
    : interviews.filter(item => getYear(item.date) === parseInt(activeFilter));

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              Interviews
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Exclusive interviews with our leaders, members, and distinguished guests.
            </p>
          </div>

          {/* Year Filter */}
          {years.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === 'all'
                    ? 'bg-gold text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                All Years
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveFilter(year.toString())}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeFilter === year.toString()
                      ? 'bg-gold text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {/* Interview Cards - Expandable */}
          <div className="space-y-4">
            {filteredInterviews.map((interview) => {
              const isExpanded = expandedId === interview._id;
              const hasImageValue = hasImage(interview);
              const videoId = interview.type === 'video' ? extractYouTubeId(interview.videoUrl) : null;

              return (
                <div
                  key={interview._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
                >
                  {/* Card Header - Always visible */}
                  <div 
                    className="flex items-start gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleExpand(interview._id)}
                  >
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                      {hasImageValue ? (
                        <img
                          src={interview.image}
                          alt={interview.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = FALLBACK_IMAGE;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Type Badge */}
                      <span className={`absolute top-1 right-1 text-[8px] px-1.5 py-0.5 rounded-full text-white ${
                        interview.type === 'video' ? 'bg-red-500' : 'bg-blue-500'
                      }`}>
                        {interview.type === 'video' ? 'Video' : 'Photo'}
                      </span>

                      {/* Play icon overlay for videos */}
                      {interview.type === 'video' && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                            <Play className="h-4 w-4 text-gold ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-army text-base line-clamp-1 group-hover:text-gold transition-colors">
                            {interview.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="flex items-center gap-1 text-xs text-gray-600">
                              <User className="h-3 w-3 text-gold" />
                              {interview.guest}
                            </span>
                            {interview.team && (
                              <span className="text-xs text-gray-400">| {interview.team}</span>
                            )}
                            <span className="text-xs text-gray-400">|</span>
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Calendar className="h-3 w-3" />
                              {formatDate(interview.date)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {interview.type === 'video' && interview.videoUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openVideo(interview.videoUrl);
                              }}
                              className="flex items-center gap-1 text-xs bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-2 py-1 rounded transition-colors"
                            >
                              <Play className="h-3 w-3" />
                              Watch
                            </button>
                          )}
                          <button className="text-gray-400 hover:text-gold transition-colors p-1">
                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                      <div className="space-y-4">
                        {/* Full Image/Video Display */}
                        {interview.type === 'video' && interview.videoUrl && videoId ? (
                          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}`}
                              className="w-full h-full"
                              allowFullScreen
                              title={interview.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          </div>
                        ) : hasImageValue ? (
                          <div className="w-full max-h-96 overflow-hidden rounded-lg">
                            <img
                              src={interview.image}
                              alt={interview.title}
                              className="w-full h-full object-contain max-h-96"
                              onError={(e) => {
                                e.target.src = FALLBACK_IMAGE;
                              }}
                            />
                          </div>
                        ) : null}

                        {/* Full Content */}
                        <div className="prose max-w-none">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {interview.content}
                          </p>
                        </div>

                        {/* Video Link */}
                        {interview.type === 'video' && interview.videoUrl && (
                          <div className="p-3 bg-white rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 flex items-center gap-2">
                              <Link2 className="h-3 w-3" />
                              Video Link: 
                              <a 
                                href={interview.videoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gold hover:text-gold-dark truncate max-w-xs"
                              >
                                {interview.videoUrl}
                              </a>
                            </p>
                          </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-200">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            Year: {getYear(interview.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Guest: {interview.guest}
                          </span>
                          {interview.team && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {interview.team}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            {interview.type === 'video' ? (
                              <Video className="h-3 w-3 text-red-500" />
                            ) : (
                              <Image className="h-3 w-3 text-blue-500" />
                            )}
                            Type: {interview.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredInterviews.length === 0 && (
            <div className="text-center py-12">
              <Mic className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No interviews available for this year.</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default Interviews;
