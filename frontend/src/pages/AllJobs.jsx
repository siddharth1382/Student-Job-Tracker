import { useState, useEffect } from 'react';
import { ROUTES, fetchWithAuth } from '../utils/config';
import { useAuth } from '../context/AuthContext';
import { FaExternalLinkAlt, FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaTrash, FaEdit, FaChevronDown, FaFilter, FaTimes, FaSort, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateSort, setDateSort] = useState('newest'); // 'newest', 'oldest'
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetchWithAuth(ROUTES.JOBS.GET_ALL);
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = [...jobs];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(job => job.status === statusFilter);
    }
    
    // Apply date sorting
    result.sort((a, b) => {
      const dateA = new Date(a.dateOfApplication || '2000-01-01');
      const dateB = new Date(b.dateOfApplication || '2000-01-01');
      
      return dateSort === 'newest' 
        ? dateB - dateA  // Newest first
        : dateA - dateB; // Oldest first
    });
    
    setFilteredJobs(result);
  }, [jobs, statusFilter, dateSort]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const response = await fetchWithAuth(ROUTES.JOBS.UPDATE(jobId), {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update job status');

      setJobs(jobs.map(job =>
        job._id === jobId ? { ...job, status: newStatus } : job
      ));
      setOpenDropdown(null);
    } catch (err) {
      console.error('Error updating job status:', err);
      setError('Failed to update job status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetchWithAuth(ROUTES.JOBS.DELETE(jobId), {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete job');

      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete job');
    }
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setDateSort('newest');
  };

  const StatusDropdown = ({ jobId, status }) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      interview: { bg: 'bg-green-100', text: 'text-green-800', label: 'Interview' },
      declined: { bg: 'bg-red-100', text: 'text-red-800', label: 'Declined' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    // Handle dropdown toggle with stopPropagation to prevent immediate close
    const toggleDropdown = (e) => {
      e.stopPropagation();
      setOpenDropdown(openDropdown === jobId ? null : jobId);
    };

    return (
      <div className="relative inline-block">
        <button 
          onClick={toggleDropdown}
          className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 border border-transparent hover:border-gray-300 transition-all`}
        >
          {config.label}
          <FaChevronDown size={10} className={`transition-transform ${openDropdown === jobId ? 'rotate-180' : ''}`} />
        </button>
        
        {openDropdown === jobId && (
          <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md py-1 z-10 min-w-32 border border-gray-200">
            {Object.keys(statusConfig).map(statusKey => (
              <button 
                key={statusKey}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(jobId, statusKey);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${status === statusKey ? 'font-medium' : ''}`}
              >
                <span className={`w-2 h-2 rounded-full ${statusConfig[statusKey].bg} border ${status === statusKey ? 'border-gray-500' : 'border-transparent'}`}></span>
                {statusConfig[statusKey].label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const TypeBadge = ({ type }) => (
    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-md border border-blue-200 flex items-center gap-1">
      <FaBriefcase size={10} />
      <span className="capitalize">{type}</span>
    </span>
  );

  const FilterPanel = () => {
    const statusOptions = [
      { value: 'all', label: 'All' },
      { value: 'pending', label: 'Pending' },
      { value: 'interview', label: 'Interview' },
      { value: 'declined', label: 'Declined' }
    ];
    
    const sortOptions = [
      { value: 'newest', label: 'Newest First', icon: <FaSortAmountDown size={14} /> },
      { value: 'oldest', label: 'Oldest First', icon: <FaSortAmountUp size={14} /> }
    ];
    
    return (
      <div className={`transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-96' : 'max-h-0'}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      statusFilter === option.value
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by Date</label>
              <div className="flex gap-2">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setDateSort(option.value)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2 ${
                      dateSort === option.value
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1 self-end"
            >
              <FaTimes size={12} />
              Reset filters
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">All Jobs</h1>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">All Jobs</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">All Jobs</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showFilters ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          <FaFilter size={14} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      <FilterPanel />
      
      <div className="bg-white px-4 py-2 rounded-lg shadow-sm mb-6 flex justify-between items-center">
        <p className="text-gray-600 font-medium">{filteredJobs.length} jobs found</p>
        {filteredJobs.length !== jobs.length && (
          <p className="text-sm text-gray-500">
            Filtered from {jobs.length} total jobs
          </p>
        )}
      </div>

      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <FaBriefcase size={48} className="text-gray-300" />
            <p className="text-gray-500 font-medium">
              {jobs.length === 0 
                ? "No jobs found. Add your first job application!" 
                : "No jobs match your current filters."}
            </p>
            {jobs.length > 0 && (
              <button 
                onClick={resetFilters}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col h-full"
            >
              {/* Header with status and job type */}
              <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <StatusDropdown jobId={job._id} status={job.status} />
                <TypeBadge type={job.jobType || 'N/A'} />
              </div>
              
              {/* Content */}
              <div className="p-5 flex-grow flex flex-col">
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">{job.position}</h3>
                  <p className="text-gray-700 font-medium">{job.company}</p>
                </div>
                
                <div className="space-y-2 mt-2 text-sm text-gray-600 flex-grow">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt size={14} className="text-gray-400" />
                    <span>{job.jobLocation || 'No location specified'}</span>
                  </div>
                  
                  {job.dateOfApplication && (
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt size={14} className="text-gray-400" />
                      <span>Applied: {new Date(job.dateOfApplication).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {job.link && (
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaExternalLinkAlt size={14} />
                      <span>View job posting</span>
                    </a>
                  )}
                </div>
              </div>
              
              {/* Footer with actions */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end items-center">                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    title="Delete job"
                  >
                    <FaTrash size={16} />
                  </button>
                  <button
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    title="Edit job"
                  >
                    <FaEdit size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}