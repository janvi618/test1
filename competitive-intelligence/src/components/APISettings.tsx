import { useState, useEffect } from 'react';
import {
  loadAPISettings,
  saveAPISettings,
  clearAPISettings,
  type APISettings as APISettingsType,
} from '../services/aiResearch';

interface Props {
  onSettingsChange: (settings: APISettingsType | null) => void;
}

export default function APISettings({ onSettingsChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [provider, setProvider] = useState<'claude' | 'openai'>('claude');
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = loadAPISettings();
    if (settings) {
      setProvider(settings.provider);
      setApiKey(settings.apiKey);
      setSaved(true);
      onSettingsChange(settings);
    }
  }, [onSettingsChange]);

  const handleSave = () => {
    if (apiKey.trim()) {
      const settings: APISettingsType = { provider, apiKey: apiKey.trim() };
      saveAPISettings(settings);
      setSaved(true);
      onSettingsChange(settings);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    clearAPISettings();
    setApiKey('');
    setSaved(false);
    onSettingsChange(null);
  };

  return (
    <div className="api-settings">
      <button
        className={`api-settings-toggle ${saved ? 'configured' : 'not-configured'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {saved ? '✓ API Configured' : '⚙ Configure API Key'}
      </button>

      {isOpen && (
        <div className="api-settings-panel">
          <h4>AI API Settings</h4>
          <p className="settings-note">
            Your API key is stored locally in your browser and never sent to our servers.
          </p>

          <div className="settings-form">
            <div className="form-group">
              <label>AI Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as 'claude' | 'openai')}
              >
                <option value="claude">Claude (Anthropic)</option>
                <option value="openai">GPT-4 (OpenAI)</option>
              </select>
            </div>

            <div className="form-group">
              <label>API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider === 'claude' ? 'sk-ant-...' : 'sk-...'}
              />
            </div>

            <div className="settings-actions">
              <button className="btn-primary" onClick={handleSave}>
                Save
              </button>
              {saved && (
                <button className="btn-secondary" onClick={handleClear}>
                  Clear
                </button>
              )}
              <button className="btn-secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
