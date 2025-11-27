import React, { useState, useEffect } from 'react';
import { 
  getEcosystemSegments, 
  updateEcosystemSegment,
  getVisionMission,
  updateVisionMission,
  getInstitutionCards,
  updateInstitutionCard,
  createEcosystemSegment,
  deleteEcosystemSegment,
  createInstitutionCard,
  deleteInstitutionCard
} from '../services/cmsService';
import { EcosystemSegment, VisionMission, InstitutionCard } from '../types';
import Button from './Button';

const CMSManagement: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'ecosystem' | 'vision' | 'institution'>('ecosystem');
  const [segments, setSegments] = useState<EcosystemSegment[]>([]);
  const [visionMission, setVisionMission] = useState<VisionMission | null>(null);
  const [institutionCards, setInstitutionCards] = useState<InstitutionCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [segmentsData, visionData, cardsData] = await Promise.all([
        getEcosystemSegments(),
        getVisionMission(),
        getInstitutionCards()
      ]);
      setSegments(segmentsData);
      setVisionMission(visionData);
      setInstitutionCards(cardsData);
    } catch (error) {
      console.error('Error fetching CMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSegment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem.id) {
        await updateEcosystemSegment(editingItem);
      } else {
        await createEcosystemSegment(editingItem);
      }
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error('Error saving segment:', error);
    }
  };

  const handleDeleteSegment = async (id: string) => {
    if (window.confirm('Delete this segment?')) {
      await deleteEcosystemSegment(id);
      fetchData();
    }
  };

  const handleSaveVision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateVisionMission(editingItem);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error('Error saving vision/mission:', error);
    }
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert bullets string to array if needed
      const dataToSave = {
        ...editingItem,
        bullets: typeof editingItem.bullets === 'string' 
          ? editingItem.bullets.split('\n').filter((b: string) => b.trim()) 
          : editingItem.bullets
      };

      if (editingItem.id) {
        await updateInstitutionCard(dataToSave);
      } else {
        await createInstitutionCard(dataToSave);
      }
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (window.confirm('Delete this card?')) {
      await deleteInstitutionCard(id);
      fetchData();
    }
  };

  if (loading) return <div>Loading CMS data...</div>;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button 
          onClick={() => setActiveSection('ecosystem')}
          className={`py-2 px-4 font-semibold ${activeSection === 'ecosystem' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500'}`}
        >
          Ecosystem Segments
        </button>
        <button 
          onClick={() => setActiveSection('vision')}
          className={`py-2 px-4 font-semibold ${activeSection === 'vision' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500'}`}
        >
          Vision & Mission
        </button>
        <button 
          onClick={() => setActiveSection('institution')}
          className={`py-2 px-4 font-semibold ${activeSection === 'institution' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500'}`}
        >
          Institution Cards
        </button>
      </div>

      {/* Ecosystem Segments Tab */}
      {activeSection === 'ecosystem' && (
        <div>
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-bold">Ecosystem Segments</h3>
            <Button onClick={() => setEditingItem({ title: '', shortDescription: '', iconName: '', order: segments.length })}>
              Add Segment
            </Button>
          </div>
          <div className="space-y-4">
            {segments.map(segment => (
              <div key={segment.id} className="border p-4 rounded flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                <div>
                  <h4 className="font-bold">{segment.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{segment.shortDescription}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => setEditingItem(segment)}>Edit</Button>
                  <Button size="sm" variant="secondary" onClick={() => handleDeleteSegment(segment.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Modal for Segment */}
          {editingItem && activeSection === 'ecosystem' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">{editingItem.id ? 'Edit' : 'Add'} Segment</h3>
                <form onSubmit={handleSaveSegment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input 
                      className="w-full p-2 border rounded dark:bg-gray-800"
                      value={editingItem.title}
                      onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                      className="w-full p-2 border rounded dark:bg-gray-800"
                      value={editingItem.shortDescription}
                      onChange={e => setEditingItem({...editingItem, shortDescription: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Order</label>
                    <input 
                      type="number"
                      className="w-full p-2 border rounded dark:bg-gray-800"
                      value={editingItem.order}
                      onChange={e => setEditingItem({...editingItem, order: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={() => setEditingItem(null)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vision & Mission Tab */}
      {activeSection === 'vision' && (
        <div>
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-bold">Vision & Mission</h3>
            <Button onClick={() => setEditingItem(visionMission || { visionText: '', missionText: '', heroImagePath: '' })}>
              Edit Content
            </Button>
          </div>
          {visionMission ? (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-bold mb-2">Vision</h4>
                <p>{visionMission.visionText}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-bold mb-2">Mission</h4>
                <p>{visionMission.missionText}</p>
              </div>
              {visionMission.heroImagePath && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
                  <h4 className="font-bold mb-2">Hero Image</h4>
                  <img src={visionMission.heroImagePath} alt="Hero" className="w-full max-h-64 object-cover rounded" />
                </div>
              )}
            </div>
          ) : (
            <p>No content set. Click Edit to add.</p>
          )}

          {/* Edit Modal for Vision */}
          {editingItem && activeSection === 'vision' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-4">Edit Vision & Mission</h3>
                <form onSubmit={handleSaveVision} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Vision Text</label>
                    <textarea 
                      className="w-full p-2 border rounded dark:bg-gray-800 h-24"
                      value={editingItem.visionText}
                      onChange={e => setEditingItem({...editingItem, visionText: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mission Text</label>
                    <textarea 
                      className="w-full p-2 border rounded dark:bg-gray-800 h-24"
                      value={editingItem.missionText}
                      onChange={e => setEditingItem({...editingItem, missionText: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hero Image URL</label>
                    <input 
                      className="w-full p-2 border rounded dark:bg-gray-800"
                      value={editingItem.heroImagePath}
                      onChange={e => setEditingItem({...editingItem, heroImagePath: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={() => setEditingItem(null)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Institution Cards Tab */}
      {activeSection === 'institution' && (
        <div>
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-bold">Institution Cards</h3>
            <Button onClick={() => setEditingItem({ title: '', bullets: '', accentColor: '#dc2626', order: institutionCards.length })}>
              Add Card
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {institutionCards.map(card => (
              <div key={card.id} className="border p-4 rounded bg-gray-50 dark:bg-gray-800">
                <div className="h-2 w-full mb-2" style={{ backgroundColor: card.accentColor }}></div>
                <h4 className="font-bold mb-2">{card.title}</h4>
                <ul className="list-disc pl-5 mb-4 text-sm">
                  {card.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => setEditingItem({...card, bullets: card.bullets.join('\n')})}>Edit</Button>
                  <Button size="sm" variant="secondary" onClick={() => handleDeleteCard(card.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Modal for Card */}
          {editingItem && activeSection === 'institution' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">{editingItem.id ? 'Edit' : 'Add'} Card</h3>
                <form onSubmit={handleSaveCard} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input 
                      className="w-full p-2 border rounded dark:bg-gray-800"
                      value={editingItem.title}
                      onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bullets (one per line)</label>
                    <textarea 
                      className="w-full p-2 border rounded dark:bg-gray-800 h-32"
                      value={editingItem.bullets}
                      onChange={e => setEditingItem({...editingItem, bullets: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Accent Color</label>
                    <input 
                      type="color"
                      className="w-full h-10 p-1 border rounded dark:bg-gray-800"
                      value={editingItem.accentColor}
                      onChange={e => setEditingItem({...editingItem, accentColor: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Order</label>
                    <input 
                      type="number"
                      className="w-full p-2 border rounded dark:bg-gray-800"
                      value={editingItem.order}
                      onChange={e => setEditingItem({...editingItem, order: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={() => setEditingItem(null)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CMSManagement;
