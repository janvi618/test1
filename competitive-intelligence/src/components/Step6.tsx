import { useState, useCallback } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { STEPS_INFO } from '../types/workflow';
import { loadAPISettings } from '../services/aiResearch';
import { callAI } from '../services/callAI';

export default function Step6() {
  const { state, updateStep6, prevStep, reset } = useWorkflow();
  const stepInfo = STEPS_INFO[5];

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateStrategy = useCallback(async () => {
    const settings = loadAPISettings();
    if (!settings) {
      setError('Please configure your API key in Step 1 first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const prompt = `You are a competitive intelligence strategist creating a final strategy and recommendations presentation using the What / So What / Now What framework.

Industry: ${state.step1.industry}
Company: ${state.step1.company}

Executive Summary: ${state.step5.executiveSummary}
Technical Roadmap: ${state.step5.technicalRoadmap}
Recommendations from analysis: ${state.step5.recommendations.join('; ')}

Opportunities:
${state.step4.opportunities.map(o => `- ${o.name}: TRL ${o.techReadinessLevel}, Prize: ${o.sizeOfPrize}`).join('\n')}

Comparison Matrix:
${state.step5.comparisonMatrix.map(m => `- ${m.option}: Feasibility ${m.feasibility}, Impact ${m.impact}, Priority ${m.priority}`).join('\n')}

Provide final strategy in this JSON format only:
{
  "insights": ["Key insight 1", "Key insight 2", "Key insight 3", "Key insight 4", "Key insight 5"],
  "strategy": "Overall strategic recommendation...",
  "recommendations": ["Specific recommendation 1", "Specific recommendation 2", "Specific recommendation 3"],
  "nextSteps": ["Immediate action 1", "Immediate action 2", "Immediate action 3", "Immediate action 4"],
  "presentationNotes": "Key talking points for stakeholder presentation..."
}`;

      const response = await callAI(prompt, settings);

      updateStep6({
        insights: (response.insights as string[]) || [],
        strategy: (response.strategy as string) || '',
        recommendations: (response.recommendations as string[]) || [],
        nextSteps: (response.nextSteps as string[]) || [],
        presentationNotes: (response.presentationNotes as string) || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate strategy');
    } finally {
      setIsGenerating(false);
    }
  }, [state.step1, state.step4, state.step5, updateStep6]);

  const hasResults = state.step6.insights.length > 0 || state.step6.strategy;

  const exportReport = () => {
    const report = `# Competitive Intelligence Report
## ${state.step1.industry} - ${state.step1.company}
Generated: ${new Date().toLocaleDateString()}

---

## Executive Summary
${state.step5.executiveSummary || 'Not generated'}

---

## Phase 1: Strategy Development

### Category Landscape
**Technical Levers:** ${state.step1.technicalLevers.join(', ') || 'None'}
**IP Whitespace:** ${state.step1.ipWhitespace.join(', ') || 'None'}
**Consumer Trends:** ${state.step1.consumerTrends.join(', ') || 'None'}

### RRW Analysis
- **Is It Real?** ${state.step3.rrwAnalysis.isItReal || 'N/A'}
- **Can We Win?** ${state.step3.rrwAnalysis.canWeWin || 'N/A'}
- **Is It Worth It?** ${state.step3.rrwAnalysis.isItWorthIt || 'N/A'}

---

## Phase 2: Technical Plan

### Opportunities Deep Dive
${state.step4.opportunities.map(opp => `
#### ${opp.name}
- **TRL:** ${opp.techReadinessLevel}
- **JTBD:** ${opp.jtbdAlignment}
- **Size of Prize:** ${opp.sizeOfPrize}
- **Consumer Needs:** ${opp.consumerNeeds.join(', ')}
`).join('\n')}

### Comparison Matrix
| Option | Feasibility | Impact | Effort | Priority |
|--------|-------------|--------|--------|----------|
${state.step5.comparisonMatrix.map(m => `| ${m.option} | ${m.feasibility}/10 | ${m.impact}/10 | ${m.effort}/10 | ${m.priority.toUpperCase()} |`).join('\n')}

### Technical Roadmap
${state.step5.technicalRoadmap || 'Not generated'}

---

## Strategy & Recommendations

### WHAT: Key Insights
${state.step6.insights.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

### SO WHAT: Strategy
${state.step6.strategy || 'Not generated'}

### SO WHAT: Recommendations
${state.step6.recommendations.map((r, idx) => `${idx + 1}. ${r}`).join('\n')}

### NOW WHAT: Next Steps
${state.step6.nextSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

---
*Report generated using the Agent-Powered Tech Competitive Intelligence Workflow*
`;

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ci-report-${state.step1.industry.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-badge phase-2">Phase 2</div>
        <h2>Step {stepInfo.number}: {stepInfo.title}</h2>
        <div className="step-meta">
          <span className="tool-badge">Tool: {stepInfo.tool}</span>
        </div>
      </div>

      <div className="step-content">
        <div className="what-so-what-banner">
          <h3>Communication Framework: What, So What, Now What</h3>
        </div>

        {/* Generate */}
        <div className="form-section">
          <h3>Generate Final Strategy</h3>
          <p className="section-desc">AI will create insights, strategy, recommendations, and next steps from all your research</p>
          {error && <div className="error-message">{error}</div>}
          <button
            className="btn-generate"
            onClick={generateStrategy}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <><span className="spinner"></span>Generating Strategy...</>
            ) : (
              <>Generate Strategy & Recommendations</>
            )}
          </button>
        </div>

        {/* Results */}
        {hasResults && (
          <>
            <div className="form-section results-section">
              <h3>WHAT: Key Insights</h3>
              {state.step6.insights.map((insight, i) => (
                <div key={i} className="result-card">
                  <p><strong>{i + 1}.</strong> {insight}</p>
                </div>
              ))}
            </div>

            {state.step6.strategy && (
              <div className="form-section results-section">
                <h3>SO WHAT: Strategy</h3>
                <div className="result-card">
                  <p>{state.step6.strategy}</p>
                </div>
              </div>
            )}

            {state.step6.recommendations.length > 0 && (
              <div className="form-section results-section">
                <h3>SO WHAT: Recommendations</h3>
                {state.step6.recommendations.map((reco, i) => (
                  <div key={i} className="result-card">
                    <p><strong>{i + 1}.</strong> {reco}</p>
                  </div>
                ))}
              </div>
            )}

            {state.step6.nextSteps.length > 0 && (
              <div className="form-section results-section">
                <h3>NOW WHAT: Next Steps</h3>
                {state.step6.nextSteps.map((step, i) => (
                  <div key={i} className="result-card">
                    <p><strong>{i + 1}.</strong> {step}</p>
                  </div>
                ))}
              </div>
            )}

            {state.step6.presentationNotes && (
              <div className="form-section">
                <div className="result-card">
                  <h4>Presentation Notes</h4>
                  <p>{state.step6.presentationNotes}</p>
                </div>
              </div>
            )}

            <div className="export-section">
              <h3>Export Report</h3>
              <p>Download a complete Markdown report with all findings from every step</p>
              <button className="btn-export" onClick={exportReport}>
                Download Full Report
              </button>
            </div>
          </>
        )}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={prevStep}>&larr; Back to Step 5</button>
        <button className="btn-reset" onClick={() => {
          if (confirm('Start a new workflow? All data will be cleared.')) {
            reset();
          }
        }}>
          Start New Workflow
        </button>
      </div>
    </div>
  );
}
