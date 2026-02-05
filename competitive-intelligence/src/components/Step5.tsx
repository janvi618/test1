import { useState, useCallback } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { STEPS_INFO } from '../types/workflow';
import { loadAPISettings } from '../services/aiResearch';
import { callAI } from '../services/callAI';

export default function Step5() {
  const { state, updateStep5, nextStep, prevStep } = useWorkflow();
  const stepInfo = STEPS_INFO[4];

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSynthesis = useCallback(async () => {
    const settings = loadAPISettings();
    if (!settings) {
      setError('Please configure your API key in Step 1 first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const prompt = `You are a competitive intelligence analyst synthesizing findings into an executive summary and workplan.

Industry: ${state.step1.industry}
Company: ${state.step1.company}

Opportunities Analyzed:
${state.step4.opportunities.map((opp, i) => `${i + 1}. ${opp.name}
   - TRL: ${opp.techReadinessLevel}
   - JTBD: ${opp.jtbdAlignment}
   - Size of Prize: ${opp.sizeOfPrize}
   - Consumer Needs: ${opp.consumerNeeds.join(', ')}`).join('\n')}

Strategy Context:
- Fit Analysis: ${state.step3.fitAnalysis}
- Internal Strategy: ${state.step3.internalStrategy}

Provide synthesis in this JSON format only:
{
  "executiveSummary": "Comprehensive executive summary of all research and findings...",
  "comparisonMatrix": [
    ${state.step4.opportunities.map(opp => `{"option": "${opp.name.replace(/"/g, '\\"')}", "feasibility": 7, "impact": 8, "effort": 5, "priority": "high"}`).join(',\n    ')}
  ],
  "technicalRoadmap": "Phased technical roadmap with milestones...",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "prioritizedOptions": ["Option 1", "Option 2"]
}`;

      const response = await callAI(prompt, settings);

      updateStep5({
        executiveSummary: (response.executiveSummary as string) || '',
        comparisonMatrix: (response.comparisonMatrix as Array<{ option: string; feasibility: number; impact: number; effort: number; priority: 'high' | 'medium' | 'low' }>) || [],
        technicalRoadmap: (response.technicalRoadmap as string) || '',
        recommendations: (response.recommendations as string[]) || [],
        prioritizedOptions: (response.prioritizedOptions as string[]) || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate synthesis');
    } finally {
      setIsGenerating(false);
    }
  }, [state.step1, state.step3, state.step4, updateStep5]);

  const hasResults = state.step5.executiveSummary || state.step5.recommendations.length > 0;

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
        {/* Summary of what we have */}
        <div className="form-section selection-section">
          <h3>Data to Synthesize</h3>
          <p className="section-desc">Summary of all research conducted across previous steps</p>
          <div className="synthesis-summary-grid">
            <div className="synthesis-card">
              <span className="synthesis-label">Industry</span>
              <span className="synthesis-value">{state.step1.industry || 'Not set'}</span>
            </div>
            <div className="synthesis-card">
              <span className="synthesis-label">Opportunities Analyzed</span>
              <span className="synthesis-value">{state.step4.opportunities.length}</span>
            </div>
            <div className="synthesis-card">
              <span className="synthesis-label">Priority Areas</span>
              <span className="synthesis-value">{state.step2.priorityAreas.length}</span>
            </div>
            <div className="synthesis-card">
              <span className="synthesis-label">Strategy</span>
              <span className="synthesis-value">{state.step3.fitAnalysis ? 'Completed' : 'Pending'}</span>
            </div>
          </div>
        </div>

        {/* Generate */}
        <div className="form-section">
          <h3>AI-Powered Synthesis</h3>
          <p className="section-desc">Generate executive summary, comparison matrix, and recommendations</p>
          {error && <div className="error-message">{error}</div>}
          <button
            className="btn-generate"
            onClick={generateSynthesis}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <><span className="spinner"></span>Synthesizing...</>
            ) : (
              <>Generate Executive Summary & Workplan</>
            )}
          </button>
        </div>

        {/* Results */}
        {hasResults && (
          <div className="form-section results-section">
            <h3>Synthesis Results</h3>

            {state.step5.executiveSummary && (
              <div className="result-card">
                <h4>Executive Summary</h4>
                <p>{state.step5.executiveSummary}</p>
              </div>
            )}

            {state.step5.comparisonMatrix.length > 0 && (
              <div className="result-card">
                <h4>Comparison Matrix</h4>
                <div className="matrix-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Option</th>
                        <th>Feasibility</th>
                        <th>Impact</th>
                        <th>Effort</th>
                        <th>Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.step5.comparisonMatrix.map((item, i) => (
                        <tr key={i}>
                          <td className="option-name">{item.option}</td>
                          <td><span className="score">{item.feasibility}/10</span></td>
                          <td><span className="score">{item.impact}/10</span></td>
                          <td><span className="score">{item.effort}/10</span></td>
                          <td>
                            <span className={`priority-badge priority-${item.priority}`}>
                              {item.priority.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {state.step5.technicalRoadmap && (
              <div className="result-card">
                <h4>Technical Roadmap</h4>
                <p>{state.step5.technicalRoadmap}</p>
              </div>
            )}

            {state.step5.recommendations.length > 0 && (
              <div className="result-card">
                <h4>Recommendations</h4>
                <ol className="result-list">
                  {state.step5.recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={prevStep}>&larr; Back to Step 4</button>
        <button className="btn-primary" onClick={nextStep}>Continue to Step 6 &rarr;</button>
      </div>
    </div>
  );
}
