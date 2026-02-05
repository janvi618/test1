import { useState, useCallback } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { STEPS_INFO } from '../types/workflow';
import { loadAPISettings } from '../services/aiResearch';
import { callAI } from '../services/callAI';

export default function Step4() {
  const { state, updateStep4, nextStep, prevStep } = useWorkflow();
  const stepInfo = STEPS_INFO[3];

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeOpp, setActiveOpp] = useState(0);

  // Use selected opportunities from Step 3
  const opportunities = state.step3.selectedOpportunities;

  const generateDeepDive = useCallback(async () => {
    const settings = loadAPISettings();
    if (!settings) {
      setError('Please configure your API key in Step 1 first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const prompt = `You are a competitive intelligence analyst performing deep research on specific opportunities.

Industry: ${state.step1.industry}
Company: ${state.step1.company}

Opportunities to analyze:
${opportunities.map((o, i) => `${i + 1}. ${o}`).join('\n')}

Context:
- RRW Assessment: Real: ${state.step3.rrwAnalysis.isItReal}; Win: ${state.step3.rrwAnalysis.canWeWin}; Worth: ${state.step3.rrwAnalysis.isItWorthIt}
- Strategy: ${state.step3.internalStrategy}

For each opportunity, provide a deep dive. Respond in this JSON format only:
{
  "opportunities": [
    ${opportunities.map((o, i) => `{
      "id": "opp-${i}",
      "name": "${o.replace(/"/g, '\\"')}",
      "jtbdAlignment": "How this addresses jobs to be done and underserved needs...",
      "consumerNeeds": ["need 1", "need 2", "need 3"],
      "techReadinessLevel": ${3 + i},
      "rwwAssessment": {"real": "...", "win": "...", "worth": "..."},
      "sizeOfPrize": "Market size estimate..."
    }`).join(',\n    ')}
  ]
}`;

      const response = await callAI(prompt, settings);
      const opps = response.opportunities as Array<{
        id: string;
        name: string;
        jtbdAlignment: string;
        consumerNeeds: string[];
        techReadinessLevel: number;
        rwwAssessment: { real: string; win: string; worth: string };
        sizeOfPrize: string;
      }>;

      if (opps && opps.length > 0) {
        updateStep4({ opportunities: opps });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate deep dive');
    } finally {
      setIsGenerating(false);
    }
  }, [state.step1, state.step3, opportunities, updateStep4]);

  const currentOpp = state.step4.opportunities[activeOpp];

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-badge phase-2">Phase 2</div>
        <h2>Step {stepInfo.number}: {stepInfo.title}</h2>
        <div className="step-meta">
          <span className="tool-badge">Tool: {stepInfo.tool}</span>
          <div className="guardrails"><strong>Guardrails:</strong> No IP invention</div>
        </div>
      </div>

      <div className="step-content">
        {opportunities.length > 0 ? (
          <>
            {/* Show opportunities from Step 3 */}
            <div className="form-section selection-section">
              <h3>Opportunities from Step 3</h3>
              <p className="section-desc">These were selected for deep dive analysis</p>
              <div className="selectable-grid">
                {opportunities.map((opp, i) => (
                  <div key={i} className="selectable-card selected">
                    <span className="card-type">Opportunity {i + 1}</span>
                    <span className="card-value">{opp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <div className="form-section">
              <h3>AI-Powered Deep Dive</h3>
              <p className="section-desc">Analyze JTBD, consumer needs, TRL, and market size for each opportunity</p>
              {error && <div className="error-message">{error}</div>}
              <button
                className="btn-generate"
                onClick={generateDeepDive}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <><span className="spinner"></span>Researching Opportunities...</>
                ) : (
                  <>Generate Deep Dive Analysis</>
                )}
              </button>
            </div>

            {/* Results with tabs */}
            {state.step4.opportunities.length > 0 && (
              <div className="form-section results-section">
                <h3>Deep Dive Results</h3>

                <div className="opportunity-tabs">
                  {state.step4.opportunities.map((opp, i) => (
                    <button
                      key={opp.id}
                      className={`opp-tab ${activeOpp === i ? 'active' : ''}`}
                      onClick={() => setActiveOpp(i)}
                    >
                      {opp.name.length > 30 ? opp.name.substring(0, 30) + '...' : opp.name}
                    </button>
                  ))}
                </div>

                {currentOpp && (
                  <div className="opportunity-results">
                    <div className="result-card">
                      <h4>Jobs To Be Done (JTBD) Alignment</h4>
                      <p>{currentOpp.jtbdAlignment}</p>
                    </div>

                    <div className="result-card">
                      <h4>Consumer Needs</h4>
                      <ul className="result-list">
                        {currentOpp.consumerNeeds.map((need, i) => (
                          <li key={i}>{need}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="result-card">
                      <h4>Tech Readiness Level</h4>
                      <div className="trl-display-inline">
                        <span className="trl-value">TRL {currentOpp.techReadinessLevel}</span>
                        <div className="trl-bar">
                          <div className="trl-fill" style={{ width: `${(currentOpp.techReadinessLevel / 9) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="rrw-results">
                      <div className="result-card rrw-result-real">
                        <h4>Real</h4>
                        <p>{currentOpp.rwwAssessment.real}</p>
                      </div>
                      <div className="result-card rrw-result-win">
                        <h4>Win</h4>
                        <p>{currentOpp.rwwAssessment.win}</p>
                      </div>
                      <div className="result-card rrw-result-worth">
                        <h4>Worth</h4>
                        <p>{currentOpp.rwwAssessment.worth}</p>
                      </div>
                    </div>

                    <div className="result-card">
                      <h4>Size of Prize</h4>
                      <p>{currentOpp.sizeOfPrize}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>No opportunities selected in Step 3. Please go back and select opportunities.</p>
            <button className="btn-secondary" onClick={prevStep}>&larr; Back to Step 3</button>
          </div>
        )}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={prevStep}>&larr; Back to Step 3</button>
        <button className="btn-primary" onClick={nextStep}>Continue to Step 5 &rarr;</button>
      </div>
    </div>
  );
}
