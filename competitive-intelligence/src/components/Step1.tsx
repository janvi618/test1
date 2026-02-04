import { useState, useCallback } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { STEPS_INFO } from '../types/workflow';
import APISettings from './APISettings';
import {
  generateResearch,
  type APISettings as APISettingsType,
} from '../services/aiResearch';

export default function Step1() {
  const { state, updateStep1, nextStep } = useWorkflow();
  const stepInfo = STEPS_INFO[0];

  const [researchQuestion, setResearchQuestion] = useState('');
  const [apiSettings, setApiSettings] = useState<APISettingsType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualEdit, setShowManualEdit] = useState(false);

  const [newLever, setNewLever] = useState('');
  const [newWhitespace, setNewWhitespace] = useState('');
  const [newTrend, setNewTrend] = useState('');

  const handleSettingsChange = useCallback((settings: APISettingsType | null) => {
    setApiSettings(settings);
  }, []);

  const handleGenerateResearch = async () => {
    if (!apiSettings) {
      setError('Please configure your API key first');
      return;
    }

    if (!state.step1.industry && !researchQuestion) {
      setError('Please enter an industry or research question');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateResearch(
        state.step1.industry || 'Technology',
        state.step1.company || '',
        researchQuestion || `Competitive landscape analysis for ${state.step1.industry}`,
        apiSettings
      );

      // Update all fields with the research results
      updateStep1({
        publicAnnouncements: result.publicAnnouncements,
        patents: result.patents,
        maActivities: result.maActivities,
        annualReports: result.annualReports,
        secFilings: result.secFilings,
        industryChanges: result.industryChanges,
        socialMediaSentiment: result.socialMediaSentiment,
        technicalLevers: result.technicalLevers,
        ipWhitespace: result.ipWhitespace,
        consumerTrends: result.consumerTrends,
      });

      setShowManualEdit(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate research');
    } finally {
      setIsGenerating(false);
    }
  };

  const addToList = (
    list: string[],
    value: string,
    setter: (v: string) => void,
    updateKey: 'technicalLevers' | 'ipWhitespace' | 'consumerTrends'
  ) => {
    if (value.trim()) {
      updateStep1({ [updateKey]: [...list, value.trim()] });
      setter('');
    }
  };

  const removeFromList = (
    list: string[],
    index: number,
    updateKey: 'technicalLevers' | 'ipWhitespace' | 'consumerTrends'
  ) => {
    updateStep1({ [updateKey]: list.filter((_, i) => i !== index) });
  };

  const hasResearchData = state.step1.publicAnnouncements || state.step1.technicalLevers.length > 0;

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-badge phase-1">Phase 1</div>
        <h2>Step {stepInfo.number}: {stepInfo.title}</h2>
        <div className="step-meta">
          <span className="tool-badge">Tool: {stepInfo.tool}</span>
          {stepInfo.guardrails.length > 0 && (
            <div className="guardrails">
              <strong>Guardrails:</strong> {stepInfo.guardrails.join(', ')}
            </div>
          )}
        </div>
      </div>

      <div className="step-content">
        {/* API Settings */}
        <div className="api-settings-container">
          <APISettings onSettingsChange={handleSettingsChange} />
        </div>

        {/* Research Input Section */}
        <div className="form-section research-input-section">
          <h3>What do you want to research?</h3>
          <p className="section-desc">
            Enter your industry, company, and research question. AI will automatically gather competitive intelligence.
          </p>

          <div className="form-row">
            <div className="form-group">
              <label>Industry *</label>
              <input
                type="text"
                value={state.step1.industry}
                onChange={(e) => updateStep1({ industry: e.target.value })}
                placeholder="e.g., Electric Vehicles, Healthcare AI, Fintech"
              />
            </div>
            <div className="form-group">
              <label>Company/Focus Area (optional)</label>
              <input
                type="text"
                value={state.step1.company}
                onChange={(e) => updateStep1({ company: e.target.value })}
                placeholder="e.g., Tesla, Your company name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Research Question</label>
            <textarea
              value={researchQuestion}
              onChange={(e) => setResearchQuestion(e.target.value)}
              placeholder="e.g., What are the emerging technologies in battery storage? Who are the key players in autonomous driving? What patents are being filed in this space?"
              rows={3}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            className="btn-generate"
            onClick={handleGenerateResearch}
            disabled={isGenerating || !apiSettings}
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                Generating Research...
              </>
            ) : (
              <>Generate Research with AI</>
            )}
          </button>

          {!apiSettings && (
            <p className="hint-text">Configure your API key above to enable AI research</p>
          )}
        </div>

        {/* Research Results / Manual Edit Section */}
        {(hasResearchData || showManualEdit) && (
          <>
            <div className="form-section">
              <div className="section-header-with-toggle">
                <h3>Research Data</h3>
                <button
                  className="btn-toggle"
                  onClick={() => setShowManualEdit(!showManualEdit)}
                >
                  {showManualEdit ? 'Hide Details' : 'Show/Edit Details'}
                </button>
              </div>

              {showManualEdit && (
                <>
                  <div className="form-group">
                    <label>Public Announcements</label>
                    <textarea
                      value={state.step1.publicAnnouncements}
                      onChange={(e) => updateStep1({ publicAnnouncements: e.target.value })}
                      placeholder="Key public announcements from major players..."
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <label>Patents</label>
                    <textarea
                      value={state.step1.patents}
                      onChange={(e) => updateStep1({ patents: e.target.value })}
                      placeholder="Recent patent filings and trends..."
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <label>M&A Activities</label>
                    <textarea
                      value={state.step1.maActivities}
                      onChange={(e) => updateStep1({ maActivities: e.target.value })}
                      placeholder="Mergers, acquisitions, partnerships..."
                      rows={3}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Annual Reports / 10-K Filings</label>
                      <textarea
                        value={state.step1.annualReports}
                        onChange={(e) => updateStep1({ annualReports: e.target.value })}
                        placeholder="Key insights from reports..."
                        rows={3}
                      />
                    </div>
                    <div className="form-group">
                      <label>SEC Filings</label>
                      <textarea
                        value={state.step1.secFilings}
                        onChange={(e) => updateStep1({ secFilings: e.target.value })}
                        placeholder="SEC filing insights..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>How Industry is Changing</label>
                    <textarea
                      value={state.step1.industryChanges}
                      onChange={(e) => updateStep1({ industryChanges: e.target.value })}
                      placeholder="Major trends and shifts in the industry..."
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <label>Consumer Sentiments (Social Media)</label>
                    <textarea
                      value={state.step1.socialMediaSentiment}
                      onChange={(e) => updateStep1({ socialMediaSentiment: e.target.value })}
                      placeholder="What consumers are saying on social platforms..."
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="form-section output-section">
              <h3>Outputs</h3>
              <p className="section-desc">Technical levers introduced by key players to sustain or advance innovations</p>

              <div className="list-input-group">
                <label>Technical Levers ({state.step1.technicalLevers.length})</label>
                <div className="list-input">
                  <input
                    type="text"
                    value={newLever}
                    onChange={(e) => setNewLever(e.target.value)}
                    placeholder="Add a technical lever..."
                    onKeyPress={(e) => e.key === 'Enter' && addToList(state.step1.technicalLevers, newLever, setNewLever, 'technicalLevers')}
                  />
                  <button onClick={() => addToList(state.step1.technicalLevers, newLever, setNewLever, 'technicalLevers')}>Add</button>
                </div>
                <ul className="tag-list">
                  {state.step1.technicalLevers.map((item, i) => (
                    <li key={i} className="tag">
                      {item}
                      <button onClick={() => removeFromList(state.step1.technicalLevers, i, 'technicalLevers')}>&times;</button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="list-input-group">
                <label>IP Whitespace ({state.step1.ipWhitespace.length})</label>
                <div className="list-input">
                  <input
                    type="text"
                    value={newWhitespace}
                    onChange={(e) => setNewWhitespace(e.target.value)}
                    placeholder="Add IP whitespace area..."
                    onKeyPress={(e) => e.key === 'Enter' && addToList(state.step1.ipWhitespace, newWhitespace, setNewWhitespace, 'ipWhitespace')}
                  />
                  <button onClick={() => addToList(state.step1.ipWhitespace, newWhitespace, setNewWhitespace, 'ipWhitespace')}>Add</button>
                </div>
                <ul className="tag-list">
                  {state.step1.ipWhitespace.map((item, i) => (
                    <li key={i} className="tag">
                      {item}
                      <button onClick={() => removeFromList(state.step1.ipWhitespace, i, 'ipWhitespace')}>&times;</button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="list-input-group">
                <label>Consumer Trends ({state.step1.consumerTrends.length})</label>
                <div className="list-input">
                  <input
                    type="text"
                    value={newTrend}
                    onChange={(e) => setNewTrend(e.target.value)}
                    placeholder="Add consumer trend..."
                    onKeyPress={(e) => e.key === 'Enter' && addToList(state.step1.consumerTrends, newTrend, setNewTrend, 'consumerTrends')}
                  />
                  <button onClick={() => addToList(state.step1.consumerTrends, newTrend, setNewTrend, 'consumerTrends')}>Add</button>
                </div>
                <ul className="tag-list">
                  {state.step1.consumerTrends.map((item, i) => (
                    <li key={i} className="tag">
                      {item}
                      <button onClick={() => removeFromList(state.step1.consumerTrends, i, 'consumerTrends')}>&times;</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={nextStep}>
          Skip to Step 2 &rarr;
        </button>
        <button className="btn-primary" onClick={nextStep}>
          Continue to Step 2 &rarr;
        </button>
      </div>
    </div>
  );
}
