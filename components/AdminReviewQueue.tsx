import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { 
  getAllCampusRegistrations, 
  getAllTalentSubmissions, 
  updateCampusRegistrationStatus, 
  updateTalentSubmissionStatus 
} from '../services/campusService';
import { CampusRegistration, TalentSubmission, SubmissionStatus } from '../types';
import Button from './Button';

const AdminReviewQueue: React.FC = () => {
  const { currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'campus' | 'talent'>('campus');
  const [campusRegistrations, setCampusRegistrations] = useState<CampusRegistration[]>([]);
  const [talentSubmissions, setTalentSubmissions] = useState<TalentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [campusData, talentData] = await Promise.all([
        getAllCampusRegistrations(),
        getAllTalentSubmissions()
      ]);
      setCampusRegistrations(campusData);
      setTalentSubmissions(talentData);
    } catch (error) {
      console.error('Error fetching review queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: SubmissionStatus, type: 'campus' | 'talent') => {
    const reviewerName = currentUser?.email || 'Admin';
    try {
      if (type === 'campus') {
        await updateCampusRegistrationStatus(id, status, adminNotes, reviewerName);
      } else {
        await updateTalentSubmissionStatus(id, status, adminNotes, reviewerName);
      }
      setSelectedItem(null);
      setAdminNotes('');
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Reviewing': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading review queue...</div>;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button 
          onClick={() => setActiveTab('campus')}
          className={`py-2 px-4 font-semibold ${activeTab === 'campus' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500'}`}
        >
          Campus Registrations ({campusRegistrations.filter(r => r.status === 'Pending').length})
        </button>
        <button 
          onClick={() => setActiveTab('talent')}
          className={`py-2 px-4 font-semibold ${activeTab === 'talent' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500'}`}
        >
          Talent Submissions ({talentSubmissions.filter(t => t.status === 'Pending').length})
        </button>
      </div>

      {activeTab === 'campus' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="p-3">College</th>
                <th className="p-3">Rep Name</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campusRegistrations.map(reg => (
                <tr key={reg.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-3">{reg.collegeName}</td>
                  <td className="p-3">{reg.studentRepName}</td>
                  <td className="p-3">{new Date(reg.submittedAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(reg.status)}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Button size="sm" onClick={() => setSelectedItem({ ...reg, type: 'campus' })}>Review</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'talent' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Skills</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {talentSubmissions.map(sub => (
                <tr key={sub.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-3">
                    <div>{sub.studentName}</div>
                    <div className="text-xs text-gray-500">{sub.collegeName}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {sub.skillCategories.map(skill => (
                        <span key={skill} className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">{skill}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Button size="sm" onClick={() => setSelectedItem({ ...sub, type: 'talent' })}>Review</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Review Submission</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {Object.entries(selectedItem).map(([key, value]) => {
                if (['id', 'type', 'resumeUrl', 'demoVideoUrl', 'status', 'adminNotes', 'reviewedBy', 'reviewedAt'].includes(key)) return null;
                return (
                  <div key={key}>
                    <label className="block text-xs font-bold text-gray-500 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                    <p className="text-sm">{Array.isArray(value) ? value.join(', ') : String(value)}</p>
                  </div>
                );
              })}
            </div>

            {selectedItem.type === 'talent' && (
              <div className="mb-6 space-y-2">
                <h4 className="font-bold">Attachments</h4>
                <div className="flex gap-4">
                  {selectedItem.resumeUrl && (
                    <a href={selectedItem.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      View Resume
                    </a>
                  )}
                  {selectedItem.demoVideoUrl && (
                    <a href={selectedItem.demoVideoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      View Video
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Admin Notes</label>
              <textarea 
                className="w-full p-2 border rounded dark:bg-gray-800"
                rows={3}
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                placeholder="Add internal notes..."
              />
            </div>

            <div className="flex justify-end space-x-3 border-t pt-4">
              <Button variant="secondary" onClick={() => setSelectedItem(null)}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleStatusUpdate(selectedItem.id, 'Rejected', selectedItem.type)}>Reject</Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(selectedItem.id, 'Approved', selectedItem.type)}>Approve</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewQueue;
