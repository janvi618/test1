import { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { STEPS_INFO } from '../types/workflow';

export default function Step3() {
  const { state, updateStep3, nextStep, prevStep } = useWorkflow();
  const stepInfo = STEPS_INFO[2];
  const [newOpportunity, setNewOpportunity] = useState('');

  const addOpportunity = () => {
    if (newOpportunity.trim()) {
      updateStep3({
        selectedOpportunities: [...state.step3.selectedOpportunities, newOpportunity.trim()],
      });
      setNewOpportunity('');
    }
  };

  const removeOpportunity = (index: number) => {
    updateStep3({
      selectedOpportunities: state.step3.selectedOpportunities.filter((_, i) => i !== index),
    });
  };

  const updateRRW = (field: 'isItReal' | 'canWeWin' | 'isItWorthIt', value: string) => {
    updateStep3({
      rrwAnalysis: {
        ...state.step3.rrwAnalysis,
        [field]: value,
      },
    });
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
          <h3>Fit Analysis</h3>
          <div className="form-group">
            <label>Strategic Fit Assessment</label>
            <textarea
              value={state.step3.fitAnalysis}
              onChange={(e) => updateStep3({ fitAnalysis: e.target.value })}
              placeholder="How do the identified opportunities align with your organization's capabilities and goals?"
              rows={4}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>RRW Analysis (Real-Win-Worth)</h3>
          <p className="section-desc">Evaluate each opportunity using the RRW framework</p>

          <div className="rrw-grid">
            <div className="rrw-card real">
              <h4>Is It Real?</h4>
              <p className="rrw-desc">Market reality & technical feasibility</p>
              <textarea
                value={state.step3.rrwAnalysis.isItReal}
                onChange={(e) => updateRRW('isItReal', e.target.value)}
                placeholder="Is the market real? Is the product real? Can we build it?"
                rows={4}
              />
            </div>

            <div className="rrw-card win">
              <h4>Can We Win?</h4>
              <p className="rrw-desc">Competitive advantage & capabilities</p>
              <textarea
                value={state.step3.rrwAnalysis.canWeWin}
                onChange={(e) => updateRRW('canWeWin', e.target.value)}
                placeholder="Do we have competitive advantage? Can we sustain it? What's our position?"
                rows={4}
              />
            </div>

            <div className="rrw-card worth">
              <h4>Is It Worth It?</h4>
              <p className="rrw-desc">Financial viability & strategic value</p>
              <textarea
                value={state.step3.rrwAnalysis.isItWorthIt}
                onChange={(e) => updateRRW('isItWorthIt', e.target.value)}
                placeholder="Will it be profitable? Does it fit our strategy? Is the risk acceptable?"
                rows={4}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>New Entrant Strategy</h3>
          <div className="form-group">
            <label>What Would a New Entrant Do?</label>
            <textarea
              value={state.step3.newEntrantStrategy}
              onChange={(e) => updateStep3({ newEntrantStrategy: e.target.value })}
              placeholder="Consider the approach a disruptive new entrant might take..."
              rows={4}
            />
          </div>
        </div>

        <div className="form-section output-section">
          <h3>Selected Opportunities for Phase 2</h3>
          <p className="section-desc">Narrow down to specific opportunities for deep dive analysis</p>

          <div className="list-input-group">
            <label>Opportunities to Pursue</label>
            <div className="list-input">
              <input
                type="text"
                value={newOpportunity}
                onChange={(e) => setNewOpportunity(e.target.value)}
                placeholder="Add an opportunity to pursue in Phase 2..."
                onKeyPress={(e) => e.key === 'Enter' && addOpportunity()}
              />
              <button onClick={addOpportunity}>Add</button>
            </div>
            <ul className="opportunity-list">
              {state.step3.selectedOpportunities.map((opp, i) => (
                <li key={i} className="opportunity-item">
                  <span className="opportunity-number">{i + 1}</span>
                  <span className="opportunity-text">{opp}</span>
                  <button className="remove-btn" onClick={() => removeOpportunity(i)}>&times;</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="form-section">
          <h3>Team Alignment</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Internal Strategy Notes</label>
              <textarea
                value={state.step3.internalStrategy}
                onChange={(e) => updateStep3({ internalStrategy: e.target.value })}
                placeholder="Document the internal strategy decisions..."
                rows={4}
              />
            </div>
            <div className="form-group">
              <label>Team Alignment Status</label>
              <textarea
                value={state.step3.teamAlignment}
                onChange={(e) => updateStep3({ teamAlignment: e.target.value })}
                placeholder="Document team alignment and stakeholder buy-in..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Reference from Step 2 */}
        {state.step2.priorityAreas.length > 0 && (
          <div className="form-section reference-section">
            <h3>Reference from Step 2</h3>
            <div className="reference-list">
              <strong>Priority Areas:</strong>
              <ul className="tag-list">
                {state.step2.priorityAreas.map((item, i) => (
                  <li key={i} className="tag tag-reference">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={prevStep}>
          &larr; Back to Step 2
        </button>
        <button className="btn-primary" onClick={nextStep}>
          Continue to Phase 2 &rarr;
        </button>
      </div>
    </div>
  );
}
