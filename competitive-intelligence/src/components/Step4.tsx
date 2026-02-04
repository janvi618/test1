import { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { STEPS_INFO, type OpportunityAnalysis } from '../types/workflow';

export default function Step4() {
  const { state, updateStep4, nextStep, prevStep } = useWorkflow();
  const stepInfo = STEPS_INFO[3];

  const [activeOpp, setActiveOpp] = useState<string | null>(
    state.step4.opportunities[0]?.id || null
  );
  const [newNeed, setNewNeed] = useState('');

  // Initialize opportunities from Step 3 if not already done
  const initializeOpportunities = () => {
    if (state.step4.opportunities.length === 0 && state.step3.selectedOpportunities.length > 0) {
      const opportunities: OpportunityAnalysis[] = state.step3.selectedOpportunities.map((name, i) => ({
        id: `opp-${i}`,
        name,
        jtbdAlignment: '',
        consumerNeeds: [],
        techReadinessLevel: 1,
        rwwAssessment: { real: '', win: '', worth: '' },
        sizeOfPrize: '',
      }));
      updateStep4({ opportunities });
      setActiveOpp(opportunities[0]?.id || null);
    }
  };

  // Call on first render
  if (state.step4.opportunities.length === 0 && state.step3.selectedOpportunities.length > 0) {
    initializeOpportunities();
  }

  const updateOpportunity = (id: string, updates: Partial<OpportunityAnalysis>) => {
    const updatedOpps = state.step4.opportunities.map((opp) =>
      opp.id === id ? { ...opp, ...updates } : opp
    );
    updateStep4({ opportunities: updatedOpps });
  };

  const activeOpportunity = state.step4.opportunities.find((o) => o.id === activeOpp);

  const addConsumerNeed = () => {
    if (newNeed.trim() && activeOpportunity) {
      updateOpportunity(activeOpportunity.id, {
        consumerNeeds: [...activeOpportunity.consumerNeeds, newNeed.trim()],
      });
      setNewNeed('');
    }
  };

  const removeConsumerNeed = (index: number) => {
    if (activeOpportunity) {
      updateOpportunity(activeOpportunity.id, {
        consumerNeeds: activeOpportunity.consumerNeeds.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-badge phase-2">Phase 2</div>
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
        {state.step4.opportunities.length === 0 ? (
          <div className="empty-state">
            <p>No opportunities selected in Step 3. Please go back and select opportunities to analyze.</p>
            <button className="btn-secondary" onClick={prevStep}>
              &larr; Back to Step 3
            </button>
          </div>
        ) : (
          <>
            <div className="opportunity-tabs">
              {state.step4.opportunities.map((opp) => (
                <button
                  key={opp.id}
                  className={`opp-tab ${activeOpp === opp.id ? 'active' : ''}`}
                  onClick={() => setActiveOpp(opp.id)}
                >
                  {opp.name}
                </button>
              ))}
            </div>

            {activeOpportunity && (
              <div className="opportunity-detail">
                <div className="form-section">
                  <h3>Jobs To Be Done (JTBD) Alignment</h3>
                  <div className="form-group">
                    <label>How does this opportunity address JTBD?</label>
                    <textarea
                      value={activeOpportunity.jtbdAlignment}
                      onChange={(e) => updateOpportunity(activeOpportunity.id, { jtbdAlignment: e.target.value })}
                      placeholder="Frame the solution space to address JTBD and underserved consumer needs..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Consumer Needs</h3>
                  <div className="list-input-group">
                    <label>Underserved Consumer Needs Addressed</label>
                    <div className="list-input">
                      <input
                        type="text"
                        value={newNeed}
                        onChange={(e) => setNewNeed(e.target.value)}
                        placeholder="Add a consumer need..."
                        onKeyPress={(e) => e.key === 'Enter' && addConsumerNeed()}
                      />
                      <button onClick={addConsumerNeed}>Add</button>
                    </div>
                    <ul className="tag-list">
                      {activeOpportunity.consumerNeeds.map((need, i) => (
                        <li key={i} className="tag">
                          {need}
                          <button onClick={() => removeConsumerNeed(i)}>&times;</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Tech Readiness Level (TRL)</h3>
                  <div className="trl-selector">
                    <input
                      type="range"
                      min="1"
                      max="9"
                      value={activeOpportunity.techReadinessLevel}
                      onChange={(e) => updateOpportunity(activeOpportunity.id, { techReadinessLevel: parseInt(e.target.value) })}
                    />
                    <div className="trl-display">
                      <span className="trl-value">TRL {activeOpportunity.techReadinessLevel}</span>
                      <span className="trl-label">{getTRLLabel(activeOpportunity.techReadinessLevel)}</span>
                    </div>
                  </div>
                  <div className="trl-scale">
                    <span>1 - Basic Research</span>
                    <span>5 - Validation</span>
                    <span>9 - Deployed</span>
                  </div>
                </div>

                <div className="form-section">
                  <h3>RWW Assessment for Tech Solutions</h3>
                  <div className="rrw-grid">
                    <div className="rrw-card real">
                      <h4>Real</h4>
                      <textarea
                        value={activeOpportunity.rwwAssessment.real}
                        onChange={(e) => updateOpportunity(activeOpportunity.id, {
                          rwwAssessment: { ...activeOpportunity.rwwAssessment, real: e.target.value }
                        })}
                        placeholder="Is this technically achievable?"
                        rows={3}
                      />
                    </div>
                    <div className="rrw-card win">
                      <h4>Win</h4>
                      <textarea
                        value={activeOpportunity.rwwAssessment.win}
                        onChange={(e) => updateOpportunity(activeOpportunity.id, {
                          rwwAssessment: { ...activeOpportunity.rwwAssessment, win: e.target.value }
                        })}
                        placeholder="Can we compete and win?"
                        rows={3}
                      />
                    </div>
                    <div className="rrw-card worth">
                      <h4>Worth</h4>
                      <textarea
                        value={activeOpportunity.rwwAssessment.worth}
                        onChange={(e) => updateOpportunity(activeOpportunity.id, {
                          rwwAssessment: { ...activeOpportunity.rwwAssessment, worth: e.target.value }
                        })}
                        placeholder="Is the investment justified?"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Size of Prize</h3>
                  <div className="form-group">
                    <label>Market Size / Revenue Potential</label>
                    <textarea
                      value={activeOpportunity.sizeOfPrize}
                      onChange={(e) => updateOpportunity(activeOpportunity.id, { sizeOfPrize: e.target.value })}
                      placeholder="Estimate the market opportunity, TAM/SAM/SOM, potential revenue..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={prevStep}>
          &larr; Back to Step 3
        </button>
        <button className="btn-primary" onClick={nextStep} disabled={state.step4.opportunities.length === 0}>
          Continue to Step 5 &rarr;
        </button>
      </div>
    </div>
  );
}

function getTRLLabel(level: number): string {
  const labels: Record<number, string> = {
    1: 'Basic principles observed',
    2: 'Technology concept formulated',
    3: 'Experimental proof of concept',
    4: 'Technology validated in lab',
    5: 'Technology validated in relevant environment',
    6: 'Technology demonstrated in relevant environment',
    7: 'System prototype demonstration',
    8: 'System complete and qualified',
    9: 'Actual system proven in operational environment',
  };
  return labels[level] || '';
}
