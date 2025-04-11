
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, fetchWithAuth } from '../utils/config';
import { Briefcase, Building, MapPin, Calendar, Link as LinkIcon, CheckCircle, X } from 'lucide-react';

export default function AddJob() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    jobLocation: '',
    status: 'pending',
    jobType: 'full-time',
    dateOfApplication: '',
    link: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetchWithAuth(ROUTES.JOBS.CREATE, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create job');
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating job:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Status color mappings
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    interview: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800'
  };

  // Job type icons
  const jobTypeIcons = {
    'full-time': <Briefcase size={16} />,
    'part-time': <Briefcase size={16} />,
    'internship': <Briefcase size={16} />,
    'remote': <MapPin size={16} />
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add Job Application</h1>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">
              <X size={20} />
            </span>
            <p className="text-red-700">{error}</p>
          </div>
          <button 
            onClick={() => setError('')}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Position */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Briefcase size={18} className="text-blue-600 mr-2" />
              <label className="text-gray-700 font-medium">Position</label>
            </div>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Building size={18} className="text-blue-600 mr-2" />
              <label className="text-gray-700 font-medium">Company</label>
            </div>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Acme Inc."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Job Location */}
          <div className="space-y-2">
            <div className="flex items-center">
              <MapPin size={18} className="text-blue-600 mr-2" />
              <label className="text-gray-700 font-medium">Job Location</label>
            </div>
            <input
              type="text"
              name="jobLocation"
              value={formData.jobLocation}
              placeholder="e.g. San Francisco, CA or Remote"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <div className="flex items-center">
              <CheckCircle size={18} className="text-blue-600 mr-2" />
              <label className="text-gray-700 font-medium">Status</label>
            </div>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">🕒 Pending</option>
              <option value="interview">🗣️ Interview</option>
              <option value="declined">❌ Declined</option>
            </select>
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Briefcase size={18} className="text-blue-600 mr-2" />
              <label className="text-gray-700 font-medium">Job Type</label>
            </div>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              {jobTypeIcons[formData.jobType]}
              <span className="ml-1">{formData.jobType.charAt(0).toUpperCase() + formData.jobType.slice(1)}</span>
            </div>
          </div>

          {/* Date of Application */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Calendar size={18} className="text-blue-600 mr-2" />
              <label className="text-gray-700 font-medium">Date of Application</label>
            </div>
            <input
              type="date"
              name="dateOfApplication"
              value={formData.dateOfApplication}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Link */}
          <div className="space-y-2">
            <div className="flex items-center">
              <LinkIcon size={18} className="text-blue-600 mr-2" />
              <label className="text-gray-700 font-medium">Application Link</label>
            </div>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://example.com/job-posting"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-10 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Job'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}