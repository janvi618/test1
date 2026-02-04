import { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { STEPS_INFO } from '../types/workflow';

export default function Step1() {
  const { state, updateStep1, nextStep } = useWorkflow();
  const stepInfo = STEPS_INFO[0];
  const [newLever, setNewLever] = useState('');
  const [newWhitespace, setNewWhitespace] = useState('');
  const [newTrend, setNewTrend] = useState('');

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
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Industry</label>
              <input
                type="text"
                value={state.step1.industry}
                onChange={(e) => updateStep1({ industry: e.target.value })}
                placeholder="e.g., Consumer Electronics, Healthcare"
              />
            </div>
            <div className="form-group">
              <label>Company/Focus Area</label>
              <input
                type="text"
                value={state.step1.company}
                onChange={(e) => updateStep1({ company: e.target.value })}
                placeholder="e.g., Your company name"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Research Data Sources</h3>
          <p className="section-desc">Collect and summarize key activities from:</p>

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
        </div>

        <div className="form-section output-section">
          <h3>Outputs</h3>
          <p className="section-desc">Technical levers introduced by key players to sustain or advance innovations</p>

          <div className="list-input-group">
            <label>Technical Levers</label>
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
            <label>IP Whitespace</label>
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
            <label>Consumer Trends</label>
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
      </div>

      <div className="step-actions">
        <button className="btn-primary" onClick={nextStep}>
          Continue to Step 2 &rarr;
        </button>
      </div>
    </div>
  );
}
