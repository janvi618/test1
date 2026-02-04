import { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { STEPS_INFO } from '../types/workflow';

export default function Step6() {
  const { state, updateStep6, prevStep, reset } = useWorkflow();
  const stepInfo = STEPS_INFO[5];

  const [newInsight, setNewInsight] = useState('');
  const [newReco, setNewReco] = useState('');
  const [newStep, setNewStep] = useState('');

  const addToList = (
    list: string[],
    value: string,
    setter: (v: string) => void,
    updateKey: 'insights' | 'recommendations' | 'nextSteps'
  ) => {
    if (value.trim()) {
      updateStep6({ [updateKey]: [...list, value.trim()] });
      setter('');
    }
  };

  const removeFromList = (
    list: string[],
    index: number,
    updateKey: 'insights' | 'recommendations' | 'nextSteps'
  ) => {
    updateStep6({ [updateKey]: list.filter((_, i) => i !== index) });
  };

  const exportReport = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `competitive-intelligence-report-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    return `# Competitive Intelligence Report
## ${state.step1.industry} - ${state.step1.company}
Generated: ${new Date().toLocaleDateString()}

---

## Executive Summary
${state.step5.executiveSummary || 'No executive summary provided.'}

---

## Phase 1: Strategy Development

### Category Landscape & Whitespace

**Industry Changes:**
${state.step1.industryChanges || 'Not documented'}

**Technical Levers:**
${state.step1.technicalLevers.map(l => `- ${l}`).join('\n') || '- None identified'}

**IP Whitespace:**
${state.step1.ipWhitespace.map(w => `- ${w}`).join('\n') || '- None identified'}

**Consumer Trends:**
${state.step1.consumerTrends.map(t => `- ${t}`).join('\n') || '- None identified'}

### IP Ontology Analysis

**Innovation Whitespace:**
${state.step2.innovationWhitespace.map(w => `- ${w}`).join('\n') || '- None identified'}

**Priority Areas:**
${state.step2.priorityAreas.map(p => `- ${p}`).join('\n') || '- None identified'}

### RRW Analysis

**Is It Real?**
${state.step3.rrwAnalysis.isItReal || 'Not assessed'}

**Can We Win?**
${state.step3.rrwAnalysis.canWeWin || 'Not assessed'}

**Is It Worth It?**
${state.step3.rrwAnalysis.isItWorthIt || 'Not assessed'}

---

## Phase 2: Technical Plan

### Selected Opportunities

${state.step4.opportunities.map(opp => `
#### ${opp.name}
- **JTBD Alignment:** ${opp.jtbdAlignment || 'Not documented'}
- **Tech Readiness Level:** TRL ${opp.techReadinessLevel}
- **Size of Prize:** ${opp.sizeOfPrize || 'Not estimated'}
- **Consumer Needs:** ${opp.consumerNeeds.join(', ') || 'None listed'}
`).join('\n') || 'No opportunities analyzed'}

### Comparison Matrix

| Option | Feasibility | Impact | Effort | Priority |
|--------|-------------|--------|--------|----------|
${state.step5.comparisonMatrix.map(item =>
  `| ${item.option} | ${item.feasibility}/10 | ${item.impact}/10 | ${item.effort}/10 | ${item.priority.toUpperCase()} |`
).join('\n') || '| No options compared | - | - | - | - |'}

### Technical Roadmap
${state.step5.technicalRoadmap || 'No roadmap defined'}

---

## Strategy & Recommendations

### Key Insights
${state.step6.insights.map((i, idx) => `${idx + 1}. ${i}`).join('\n') || 'No insights documented'}

### Strategy
${state.step6.strategy || 'No strategy defined'}

### Recommendations
${state.step6.recommendations.map((r, idx) => `${idx + 1}. ${r}`).join('\n') || 'No recommendations'}

### Next Steps
${state.step6.nextSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n') || 'No next steps defined'}

---

*Report generated using the Agent-Powered Tech Competitive Intelligence Workflow*
`;
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
        <div className="what-so-what-banner">
          <h3>Communication Framework: What, So What, Now What</h3>
        </div>

        <div className="form-section">
          <h3>WHAT: Key Insights</h3>
          <p className="section-desc">What did we learn from the research?</p>
          <div className="list-input-group">
            <div className="list-input">
              <input
                type="text"
                value={newInsight}
                onChange={(e) => setNewInsight(e.target.value)}
                placeholder="Add a key insight..."
                onKeyPress={(e) => e.key === 'Enter' && addToList(state.step6.insights, newInsight, setNewInsight, 'insights')}
              />
              <button onClick={() => addToList(state.step6.insights, newInsight, setNewInsight, 'insights')}>Add</button>
            </div>
            <ol className="numbered-list">
              {state.step6.insights.map((item, i) => (
                <li key={i}>
                  <span>{item}</span>
                  <button className="remove-btn" onClick={() => removeFromList(state.step6.insights, i, 'insights')}>&times;</button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="form-section">
          <h3>SO WHAT: Strategy</h3>
          <p className="section-desc">Why does this matter? What's our strategic response?</p>
          <div className="form-group">
            <textarea
              value={state.step6.strategy}
              onChange={(e) => updateStep6({ strategy: e.target.value })}
              placeholder="Define the overall strategy based on the insights..."
              rows={5}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>SO WHAT: Recommendations</h3>
          <div className="list-input-group">
            <div className="list-input">
              <input
                type="text"
                value={newReco}
                onChange={(e) => setNewReco(e.target.value)}
                placeholder="Add a recommendation..."
                onKeyPress={(e) => e.key === 'Enter' && addToList(state.step6.recommendations, newReco, setNewReco, 'recommendations')}
              />
              <button onClick={() => addToList(state.step6.recommendations, newReco, setNewReco, 'recommendations')}>Add</button>
            </div>
            <ol className="numbered-list">
              {state.step6.recommendations.map((item, i) => (
                <li key={i}>
                  <span>{item}</span>
                  <button className="remove-btn" onClick={() => removeFromList(state.step6.recommendations, i, 'recommendations')}>&times;</button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="form-section">
          <h3>NOW WHAT: Next Steps</h3>
          <p className="section-desc">What actions should be taken?</p>
          <div className="list-input-group">
            <div className="list-input">
              <input
                type="text"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                placeholder="Add a next step..."
                onKeyPress={(e) => e.key === 'Enter' && addToList(state.step6.nextSteps, newStep, setNewStep, 'nextSteps')}
              />
              <button onClick={() => addToList(state.step6.nextSteps, newStep, setNewStep, 'nextSteps')}>Add</button>
            </div>
            <ol className="numbered-list action-list">
              {state.step6.nextSteps.map((item, i) => (
                <li key={i}>
                  <span>{item}</span>
                  <button className="remove-btn" onClick={() => removeFromList(state.step6.nextSteps, i, 'nextSteps')}>&times;</button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="form-section">
          <h3>Presentation Notes</h3>
          <div className="form-group">
            <textarea
              value={state.step6.presentationNotes}
              onChange={(e) => updateStep6({ presentationNotes: e.target.value })}
              placeholder="Additional notes for the presentation deck..."
              rows={4}
            />
          </div>
        </div>

        <div className="export-section">
          <h3>Export Report</h3>
          <p>Generate a markdown report with all findings</p>
          <button className="btn-export" onClick={exportReport}>
            Download Report (Markdown)
          </button>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={prevStep}>
          &larr; Back to Step 5
        </button>
        <button className="btn-reset" onClick={() => {
          if (confirm('Are you sure you want to start over? All data will be lost.')) {
            reset();
          }
        }}>
          Start New Workflow
        </button>
      </div>
    </div>
  );
}
