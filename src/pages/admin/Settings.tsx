import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Save } from 'lucide-react';
import { LogoMark } from '../../components/LogoMark';
import {
  DEFAULT_STORE_SETTINGS,
  loadStoreSettingsFromSupabase,
  saveStoreSettingsToSupabase
} from '../../data/storeSettings';
export function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [showSecondaryAnnouncement, setShowSecondaryAnnouncement] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_STORE_SETTINGS);

  React.useEffect(() => {
    (async () => {
      const remote = await loadStoreSettingsFromSupabase();
      if (remote) {
        setSettings(remote);
        setShowSecondaryAnnouncement(Boolean(remote.announcementSecondary?.trim()));
      }
    })();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStoreSettingsToSupabase(settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };
  const field = (label: string, key: keyof typeof settings, type = 'text') =>
  <div>
      <label className="block text-sm font-medium text-text-light mb-2">
        {label}
      </label>
      <input
      type={type}
      value={settings[key]}
      onChange={(e) =>
      setSettings({
        ...settings,
        [key]: e.target.value
      })
      }
      className="w-full px-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20" />
    
    </div>;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-text mb-2">
          Settings
        </h1>
        <p className="text-text-light">
          Manage your store's general configuration.
        </p>
      </div>

      <form onSubmit={save} className="max-w-3xl space-y-8">
        {/* Branding */}
        <div className="bg-white rounded-2xl shadow-soft border border-accent p-8">
          <h2 className="font-serif font-semibold text-lg mb-6">Branding</h2>
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 flex items-center justify-center">
              <LogoMark size="lg" />
            </div>
            <div>
              <p className="text-sm text-text-light mb-2">
                Upload your store logo via the{' '}
                <span className="font-medium text-primary">Publish</span> button
                to replace this placeholder mark.
              </p>
            </div>
          </div>
          {field('Store Name', 'storeName')}
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-2xl shadow-soft border border-accent p-8">
          <h2 className="font-serif font-semibold text-lg mb-6">Announcements</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">
                Primary Announcement
              </label>
              <textarea
                value={settings.announcementPrimary}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcementPrimary: e.target.value
                  })
                }
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
            {showSecondaryAnnouncement ? (
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label className="block text-sm font-medium text-text-light">
                    Secondary Announcement
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSecondaryAnnouncement(false);
                      setSettings({
                        ...settings,
                        announcementSecondary: ''
                      });
                    }}
                    className="text-xs font-medium text-red-500 hover:text-red-600">
                    Remove
                  </button>
                </div>
                <textarea
                  value={settings.announcementSecondary}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      announcementSecondary: e.target.value
                    })
                  }
                  rows={2}
                  placeholder="Optional second banner text"
                  className="w-full px-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSecondaryAnnouncement(true)}
                className="justify-self-start px-4 py-2 rounded-xl border border-dashed border-accent text-sm text-text-light hover:text-text hover:bg-accent/20 transition-colors">
                + Add second announcement
              </button>
            )}
          </div>
        </div>

        {/* Regional */}
        <div className="bg-white rounded-2xl shadow-soft border border-accent p-8">
          <h2 className="font-serif font-semibold text-lg mb-6">Regional</h2>
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) =>
              setSettings({
                ...settings,
                currency: e.target.value
              })
              }
              className="w-full px-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20">
              
              <option>PKR (Rs)</option>
            </select>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-soft border border-accent p-8">
          <h2 className="font-serif font-semibold text-lg mb-6">
            Contact & Support
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {field('Support Email', 'email', 'email')}
            {field('Phone Number', 'phone', 'tel')}
            {field('WhatsApp Number', 'whatsapp', 'tel')}
            {field('Store Address', 'address')}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" className="btn-premium flex items-center gap-2">
            <Save className="w-5 h-5" /> Save Changes
          </button>
          {saved &&
          <span className="text-secondary text-sm font-medium">
              Settings saved successfully!
            </span>
          }
        </div>
      </form>
    </AdminLayout>);

}
