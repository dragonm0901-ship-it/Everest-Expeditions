import { useState, useEffect } from 'react';
import { 
  Package, MapPin, Globe, ExternalLink, Edit2, Plus, 
  X, Save, Upload, Loader2, Image as ImageIcon, CheckCircle2 
} from 'lucide-react';
import { 
  fetchAdminDestinations, 
  saveAdminDestination, 
  uploadAdminFile 
} from '../lib/adminClient.js';

/**
 * ImageUploader Component
 * Professional drop-zone and file selection with status feedback.
 */
function ImageUploader({ label, value, onUpload, folder = 'destinations' }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadAdminFile(file);
      onUpload(result.url);
    } catch (err) {
      setError('Upload failed. Try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="editor-field">
      <label className="editor-label">{label}</label>
      <div className="image-uploader">
        {value ? (
          <img src={value} alt="Preview" className="image-uploader__preview" />
        ) : (
          <div className="image-uploader__placeholder">
            <div className="rich-icon"><ImageIcon size={24} /></div>
            <p className="text-small font-bold">No image selected</p>
          </div>
        )}
        
        <input 
          type="file" 
          className="image-uploader__input" 
          onChange={handleFileChange}
          accept="image/*"
        />

        <div className="image-uploader__overlay">
          {isUploading ? (
            <div className="status-indicator">
              <Loader2 className="animate-spin" size={20} />
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="status-indicator">
              <Upload size={18} />
              <span>Click or drop to {value ? 'change' : 'upload'}</span>
            </div>
          )}
        </div>
        {error && <span className="text-small text-danger mt-2">{error}</span>}
      </div>
    </div>
  );
}

/**
 * DestinationEditor Component
 * Full-screen modal for editing destination details and itineraries.
 */
function DestinationEditor({ destination, onClose, onSave }) {
  const [formData, setFormData] = useState(destination || {
    slug: '',
    title: '',
    shortTitle: '',
    country: 'Nepal',
    region: '',
    eyebrow: '',
    meta: '',
    rating: 'Elite mountain guiding',
    heroImage: '',
    cardImage: '',
    summary: '',
    description: '',
    gallery: [],
    idealFor: [],
    highlights: [],
    itinerary: [],
    bestSeason: '',
    seoDescription: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveAdminDestination(formData);
      onSave();
      onClose();
    } catch (err) {
      alert('Failed to save destination: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-container">
        <header className="admin-modal__header">
          <div className="flex items-center gap-4">
            <div className="rich-icon rich-icon--mini"><MapPin size={16} /></div>
            <h3 className="font-bold">{destination ? 'Edit Destination' : 'New Destination'}</h3>
          </div>
          <button onClick={onClose} className="icon-link-button"><X size={20} /></button>
        </header>

        <form onSubmit={handleSave} className="admin-modal__body">
          <div className="editor-grid">
            <div className="editor-field">
              <label className="editor-label">Slug (Unique ID)</label>
              <input 
                name="slug" 
                value={formData.slug} 
                onChange={handleChange} 
                className="editor-input" 
                placeholder="e.g. upper-mustang"
                disabled={!!destination}
                required 
              />
            </div>
            <div className="editor-field">
              <label className="editor-label">Region</label>
              <input 
                name="region" 
                value={formData.region} 
                onChange={handleChange} 
                className="editor-input" 
                placeholder="e.g. Khumbu"
                required 
              />
            </div>
            <div className="editor-field--full">
              <label className="editor-label">Display Title</label>
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                className="editor-input" 
                placeholder="The full name of the destination"
                required 
              />
            </div>

            <ImageUploader 
              label="Card Image (Landscape)" 
              value={formData.cardImage} 
              onUpload={(url) => setFormData(p => ({ ...p, cardImage: url }))} 
            />
            <ImageUploader 
              label="Hero Image (Wide)" 
              value={formData.heroImage} 
              onUpload={(url) => setFormData(p => ({ ...p, heroImage: url }))} 
            />

            <div className="editor-field--full">
              <label className="editor-label">Summary</label>
              <textarea 
                name="summary" 
                value={formData.summary} 
                onChange={handleChange} 
                className="editor-textarea" 
                placeholder="Brief snapshot for cards..."
              />
            </div>

            <div className="editor-field">
              <label className="editor-label">Meta Info (Price/Note)</label>
              <input 
                name="meta" 
                value={formData.meta} 
                onChange={handleChange} 
                className="editor-input" 
                placeholder="e.g. From USD 3,200"
              />
            </div>
            <div className="editor-field">
              <label className="editor-label">Best Season</label>
              <input 
                name="bestSeason" 
                value={formData.bestSeason} 
                onChange={handleChange} 
                className="editor-input" 
                placeholder="e.g. Mar-May"
              />
            </div>
          </div>
        </form>

        <footer className="admin-modal__footer">
          <button type="button" onClick={onClose} className="btn-ghost" disabled={isSaving}>Cancel</button>
          <button type="submit" onClick={handleSave} className="btn-primary" disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? 'Saving...' : 'Save Destination'}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function AdminPackages() {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDest, setEditingDest] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const loadDestinations = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminDestinations();
      setDestinations(data.destinations);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  return (
    <div className="packages-view">
      <div className="view-header">
        <div className="view-header__title">
          <div className="rich-icon rich-icon--large"><Package size={32} /></div>
          <div>
            <h2>Travel Catalog</h2>
            <p className="text-muted">Manage Nepal destinations, itineraries, and media assets.</p>
          </div>
        </div>
        <div className="calendar-header-meta">
          <button onClick={() => setIsCreating(true)} className="btn-primary">
            <Plus size={18} />
            <span>Add Destination</span>
          </button>
        </div>
      </div>

      <div className="traveler-list">
        {isLoading ? (
          <div className="flex items-center justify-center p-20 w-full">
            <Loader2 className="animate-spin text-brand" size={40} />
          </div>
        ) : (
          destinations.map((dest) => (
            <article className="dashboard-card traveler-card" key={dest.slug}>
              <div className="traveler-card__main">
                <div className="traveler-avatar-wrapper">
                  <img src={dest.cardImage} alt="" className="traveler-avatar" style={{ borderRadius: '12px' }} />
                </div>
                <div className="traveler-info">
                  <h3>{dest.title}</h3>
                  <span>{dest.region}, {dest.country}</span>
                </div>
              </div>

              <div className="traveler-card__details">
                <div className="detail-pill">
                  <div className="rich-icon rich-icon--mini"><Globe size={14} /></div>
                  <span>{dest.eyebrow}</span>
                </div>
                <div className="detail-pill">
                  <div className="rich-icon rich-icon--mini"><MapPin size={14} /></div>
                  <span>{dest.slug}</span>
                </div>
              </div>

              <div className="traveler-card__status">
                <div className="text-small font-bold">
                  {dest.meta}
                </div>
                <button onClick={() => setEditingDest(dest)} className="icon-link-button">
                  <Edit2 size={18} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {(editingDest || isCreating) && (
        <DestinationEditor 
          destination={editingDest} 
          onClose={() => { setEditingDest(null); setIsCreating(false); }}
          onSave={loadDestinations}
        />
      )}
      
      <div className="settings-footer" style={{ marginTop: '2rem' }}>
        <p className="text-muted text-small flex items-center gap-2">
          <CheckCircle2 size={14} className="text-green" />
          Live sync enabled. Changes are reflected on the public site immediately.
        </p>
      </div>
    </div>
  );
}
