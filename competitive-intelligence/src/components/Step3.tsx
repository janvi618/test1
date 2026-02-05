import { useState, useCallback } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { STEPS_INFO } from '../types/workflow';
import { loadAPISettings } from '../services/aiResearch';
import { callAI } from '../services/callAI';

export default function Step3() {
  const { state, updateStep3, nextStep, prevStep } = useWorkflow();
  const stepInfo = STEPS_INFO[2];

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Items from Step 2 for selection as opportunities
  const step2Items = [
    ...state.step2.innovationWhitespace.map(item => ({ type: 'Innovation Whitespace', value: item })),
    ...state.step2.priorityAreas.map(item => ({ type: 'Priority Area', value: item })),
  ];

  const isSelected = (item: string) => state.step3.selectedOpportunities.includes(item);

  const toggleSelection = (item: string) => {
    if (isSelected(item)) {
      updateStep3({
        selectedOpportunities: state.step3.selectedOpportunities.filter(i => i !== item),
      });
    } else {
      updateStep3({
        selectedOpportunities: [...state.step3.selectedOpportunities, item],
      });
    }
  };

  const selectAll = () => {
    updateStep3({ selectedOpportunities: step2Items.map(i => i.value) });
  };

  const clearAll = () => {
    updateStep3({ selectedOpportunities: [] });
  };

  const generateStrategy = useCallback(async () => {
    const settings = loadAPISettings();
    if (!settings) {
      setError('Please configure your API key in Step 1 first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const prompt = `You are a competitive intelligence strategist. Based on the selected opportunities, perform an RRW (Real-Win-Worth) analysis and develop a business fit strategy.

Industry: ${state.step1.industry}
Company: ${state.step1.company}

Selected Opportunities:
${state.step3.selectedOpportunities.map((o, i) => `${i + 1}. ${o}`).join('\n')}

Context from research:
- Industry Changes: ${state.step1.industryChanges}
- IP Analysis: ${state.step2.ipCrowdedness}
- Ecosystem Map: ${state.step2.e2eEcosystemMap}

Provide analysis in this JSON format only:
{
  "fitAnalysis": "How these opportunities align with organizational capabilities...",
  "isItReal": "Market reality and technical feasibility assessment...",
  "canWeWin": "Competitive advantage and capabilities assessment...",
  "isItWorthIt": "Financial viability and strategic value assessment...",
  "newEntrantStrategy": "What a disruptive new entrant would do...",
  "internalStrategy": "Recommended internal strategy...",
  "teamAlignment": "Key stakeholders and alignment needed..."
}`;

      const response = await callAI(prompt, settings);

      updateStep3({
        fitAnalysis: (response.fitAnalysis as string) || '',
        rrwAnalysis: {
          isItReal: (response.isItReal as string) || '',
          canWeWin: (response.canWeWin as string) || '',
          isItWorthIt: (response.isItWorthIt as string) || '',
        },
        newEntrantStrategy: (response.newEntrantStrategy as string) || '',
        internalStrategy: (response.internalStrategy as string) || '',
        teamAlignment: (response.teamAlignment as string) || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate strategy');
    } finally {
      setIsGenerating(false);
    }
  }, [state.step1, state.step2, state.step3.selectedOpportunities, updateStep3]);

  const hasResults = state.step3.fitAnalysis || state.step3.rrwAnalysis.isItReal;

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-badge phase-1">Phase 1</div>
        <h2>Step {stepInfo.number}: {stepInfo.title}</h2>
        <div className="step-meta">
          <span className="tool-badge">Tool: {stepInfo.tool}</span>
        </div>
      </div>

      <div className="step-content">
        {step2Items.length > 0 ? (
          <div className="form-section selection-section">
            <div className="section-header-with-actions">
              <div>
                <h3>Select Opportunities to Evaluate</h3>
                <p className="section-desc">Choose which items to run through RRW (Real-Win-Worth) analysis</p>
              </div>
              <div className="selection-actions">
                <button className="btn-small" onClick={selectAll}>Select All</button>
                <button className="btn-small btn-outline" onClick={clearAll}>Clear</button>
              </div>
            </div>

            <div className="selectable-grid">
              {step2Items.map((item, i) => (
                <div
                  key={i}
                  className={`selectable-card ${isSelected(item.value) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(item.value)}
                >
                  <span className="card-type">{item.type}</span>
                  <span className="card-value">{item.value}</span>
                  <div className="card-checkbox">{isSelected(item.value) ? '✓' : ''}</div>
                </div>
              ))}
            </div>

            <div className="selection-summary">
              <strong>{state.step3.selectedOpportunities.length}</strong> of {step2Items.length} items selected
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>No data from Step 2. Go back and complete the previous step.</p>
            <button className="btn-secondary" onClick={prevStep}>&larr; Back to Step 2</button>
          </div>
        )}

        <div className="form-section">
          <h3>AI-Powered Strategy Analysis</h3>
          <p className="section-desc">Generate RRW analysis and business fit strategy</p>
          {error && <div className="error-message">{error}</div>}
          <button
            className="btn-generate"
            onClick={generateStrategy}
            disabled={isGenerating || state.step3.selectedOpportunities.length === 0}
          >
            {isGenerating ? (
              <><span className="spinner"></span>Generating Strategy...</>
            ) : (
              <>Generate RRW & Strategy Analysis</>
            )}
          </button>
          {state.step3.selectedOpportunities.length === 0 && (
            <p className="hint-text">Select at least one opportunity above</p>
          )}
        </div>

        {hasResults && (
          <div className="form-section results-section">
            <h3>Strategy Analysis Results</h3>

            {state.step3.fitAnalysis && (
              <div className="result-card"><h4>Strategic Fit Assessment</h4><p>{state.step3.fitAnalysis}</p></div>
            )}

            <div className="rrw-results">
              {state.step3.rrwAnalysis.isItReal && (
                <div className="result-card rrw-result-real"><h4>Is It Real?</h4><p>{state.step3.rrwAnalysis.isItReal}</p></div>
              )}
              {state.step3.rrwAnalysis.canWeWin && (
                <div className="result-card rrw-result-win"><h4>Can We Win?</h4><p>{state.step3.rrwAnalysis.canWeWin}</p></div>
              )}
              {state.step3.rrwAnalysis.isItWorthIt && (
                <div className="result-card rrw-result-worth"><h4>Is It Worth It?</h4><p>{state.step3.rrwAnalysis.isItWorthIt}</p></div>
              )}
            </div>

            {state.step3.newEntrantStrategy && (
              <div className="result-card"><h4>New Entrant Strategy</h4><p>{state.step3.newEntrantStrategy}</p></div>
            )}
            {state.step3.internalStrategy && (
              <div className="result-card"><h4>Internal Strategy</h4><p>{state.step3.internalStrategy}</p></div>
            )}
            {state.step3.teamAlignment && (
              <div className="result-card"><h4>Team Alignment</h4><p>{state.step3.teamAlignment}</p></div>
            )}
          </div>
        )}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={prevStep}>&larr; Back to Step 2</button>
        <button className="btn-primary" onClick={nextStep}>Continue to Phase 2 &rarr;</button>
      </div>
    </div>
  );
}
