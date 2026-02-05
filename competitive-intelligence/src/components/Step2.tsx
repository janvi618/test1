import { useState, useCallback } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { STEPS_INFO } from '../types/workflow';
import { loadAPISettings } from '../services/aiResearch';
import { callAI } from '../services/callAI';

export default function Step2() {
  const { state, updateStep2, nextStep, prevStep } = useWorkflow();
  const stepInfo = STEPS_INFO[1];

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Combine all items from Step 1 for selection
  const step1Items = [
    ...state.step1.technicalLevers.map(item => ({ type: 'Technical Lever', value: item })),
    ...state.step1.ipWhitespace.map(item => ({ type: 'IP Whitespace', value: item })),
    ...state.step1.consumerTrends.map(item => ({ type: 'Consumer Trend', value: item })),
  ];

  const isSelected = (item: string) => state.step2.priorityAreas.includes(item);

  const toggleSelection = (item: string) => {
    if (isSelected(item)) {
      updateStep2({
        priorityAreas: state.step2.priorityAreas.filter(i => i !== item)
      });
    } else {
      updateStep2({
        priorityAreas: [...state.step2.priorityAreas, item]
      });
    }
  };

  const selectAll = () => {
    const allItems = step1Items.map(i => i.value);
    updateStep2({ priorityAreas: allItems });
  };

  const clearAll = () => {
    updateStep2({ priorityAreas: [] });
  };

  // Generate AI analysis based on Step 1 data
  const generateAnalysis = useCallback(async () => {
    const settings = loadAPISettings();
    if (!settings) {
      setError('Please configure your API key in Step 1 first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const prompt = `You are a competitive intelligence analyst. Based on this research data, provide a detailed IP ontology and whitespace analysis.

Industry: ${state.step1.industry}
Company: ${state.step1.company}

Research Data:
- Technical Levers: ${state.step1.technicalLevers.join(', ')}
- IP Whitespace: ${state.step1.ipWhitespace.join(', ')}
- Consumer Trends: ${state.step1.consumerTrends.join(', ')}
- Industry Changes: ${state.step1.industryChanges}
- Patents: ${state.step1.patents}

Provide analysis in this JSON format only:
{
  "ontologyResearchTree": "Detailed hierarchy of technologies and concepts...",
  "ipCrowdedness": "Analysis of patent density and competitive positioning...",
  "meceMindmap": "MECE breakdown of the opportunity space...",
  "e2eEcosystemMap": "End-to-end ecosystem analysis...",
  "newEntrantAnalysis": "What a disruptive new entrant would do...",
  "innovationWhitespace": ["whitespace area 1", "whitespace area 2", "whitespace area 3"]
}`;

      const response = await callAI(prompt, settings);

      updateStep2({
        ontologyResearchTree: (response.ontologyResearchTree as string) || '',
        ipCrowdedness: (response.ipCrowdedness as string) || '',
        meceMindmap: (response.meceMindmap as string) || '',
        e2eEcosystemMap: (response.e2eEcosystemMap as string) || '',
        newEntrantAnalysis: (response.newEntrantAnalysis as string) || '',
        innovationWhitespace: (response.innovationWhitespace as string[]) || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
    } finally {
      setIsGenerating(false);
    }
  }, [state.step1, updateStep2]);

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
        {/* Selection from Step 1 */}
        {step1Items.length > 0 ? (
          <div className="form-section selection-section">
            <div className="section-header-with-actions">
              <div>
                <h3>Select Priority Areas from Step 1</h3>
                <p className="section-desc">Click items to select which areas to prioritize for deeper analysis</p>
              </div>
              <div className="selection-actions">
                <button className="btn-small" onClick={selectAll}>Select All</button>
                <button className="btn-small btn-outline" onClick={clearAll}>Clear</button>
              </div>
            </div>

            <div className="selectable-grid">
              {step1Items.map((item, i) => (
                <div
                  key={i}
                  className={`selectable-card ${isSelected(item.value) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(item.value)}
                >
                  <span className="card-type">{item.type}</span>
                  <span className="card-value">{item.value}</span>
                  <div className="card-checkbox">
                    {isSelected(item.value) ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>

            <div className="selection-summary">
              <strong>{state.step2.priorityAreas.length}</strong> of {step1Items.length} items selected
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>No research data from Step 1. Please go back and generate research first.</p>
            <button className="btn-secondary" onClick={prevStep}>
              &larr; Back to Step 1
            </button>
          </div>
        )}

        {/* AI Analysis Section */}
        <div className="form-section">
          <h3>AI-Powered Analysis</h3>
          <p className="section-desc">Generate detailed IP ontology and whitespace analysis based on your selections</p>

          {error && <div className="error-message">{error}</div>}

          <button
            className="btn-generate"
            onClick={generateAnalysis}
            disabled={isGenerating || state.step2.priorityAreas.length === 0}
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              <>Generate IP & Whitespace Analysis</>
            )}
          </button>

          {state.step2.priorityAreas.length === 0 && (
            <p className="hint-text">Select at least one item above to enable analysis</p>
          )}
        </div>

        {/* Analysis Results */}
        {(state.step2.ontologyResearchTree || state.step2.innovationWhitespace.length > 0) && (
          <div className="form-section results-section">
            <h3>Analysis Results</h3>

            {state.step2.ontologyResearchTree && (
              <div className="result-card">
                <h4>Ontology Research Tree</h4>
                <p>{state.step2.ontologyResearchTree}</p>
              </div>
            )}

            {state.step2.ipCrowdedness && (
              <div className="result-card">
                <h4>IP Crowdedness</h4>
                <p>{state.step2.ipCrowdedness}</p>
              </div>
            )}

            {state.step2.meceMindmap && (
              <div className="result-card">
                <h4>MECE Mindmap</h4>
                <p>{state.step2.meceMindmap}</p>
              </div>
            )}

            {state.step2.e2eEcosystemMap && (
              <div className="result-card">
                <h4>E2E Ecosystem Map</h4>
                <p>{state.step2.e2eEcosystemMap}</p>
              </div>
            )}

            {state.step2.newEntrantAnalysis && (
              <div className="result-card">
                <h4>New Entrant Analysis</h4>
                <p>{state.step2.newEntrantAnalysis}</p>
              </div>
            )}

            {state.step2.innovationWhitespace.length > 0 && (
              <div className="result-card">
                <h4>Innovation Whitespace Areas</h4>
                <ul className="result-list">
                  {state.step2.innovationWhitespace.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={prevStep}>
          &larr; Back to Step 1
        </button>
        <button className="btn-primary" onClick={nextStep}>
          Continue to Step 3 &rarr;
        </button>
      </div>
    </div>
  );
}

