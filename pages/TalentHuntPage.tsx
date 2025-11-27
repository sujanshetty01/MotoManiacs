import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createTalentSubmission } from '../services/campusService';
import Button from '../components/Button';

const TalentHuntPage: React.FC = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    collegeName: '',
    contactEmail: '',
    contactPhone: '',
    profileLink: '',
    skillCategories: [] as string[]
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const skillOptions = ['Driver', 'Mechanic', 'Marketing', 'Design', 'Logistics', 'Team Management'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (skill: string) => {
    setFormData(prev => {
      const skills = prev.skillCategories.includes(skill)
        ? prev.skillCategories.filter(s => s !== skill)
        : [...prev.skillCategories, skill];
      return { ...prev, skillCategories: skills };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'video') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'resume') setResumeFile(e.target.files[0]);
      else setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      setError('Please upload your resume.');
      return;
    }
    if (formData.skillCategories.length === 0) {
      setError('Please select at least one skill category.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createTalentSubmission(formData, resumeFile, videoFile || undefined);
      setSuccess(true);
      setFormData({
        studentName: '',
        collegeName: '',
        contactEmail: '',
        contactPhone: '',
        profileLink: '',
        skillCategories: []
      });
      setResumeFile(null);
      setVideoFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            MotoManiacs Talent Hunt
          </motion.h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Showcase your skills and get scouted by top racing teams and industry leaders.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 max-w-3xl mx-auto border border-gray-200 dark:border-gray-800">
          {success ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your profile has been sent to our scouting team. Good luck!
              </p>
              <Button onClick={() => setSuccess(false)} className="mt-6">Submit Another</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Talent Application Form</h2>
              
              {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input 
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">College/Institution</label>
                  <input 
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input 
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn/Portfolio URL</label>
                <input 
                  type="url"
                  name="profileLink"
                  value={formData.profileLink}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Skills (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillChange(skill)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        formData.skillCategories.includes(skill)
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-semibold mb-4">Uploads</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Resume (PDF)</label>
                    <input 
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, 'resume')}
                      required
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:file:bg-red-900/30 dark:file:text-red-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Demo Video (Optional, MP4)</label>
                    <input 
                      type="file"
                      accept="video/mp4,video/quicktime"
                      onChange={(e) => handleFileChange(e, 'video')}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:file:bg-red-900/30 dark:file:text-red-300"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="w-full md:w-auto">
                  {loading ? 'Uploading & Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentHuntPage;
