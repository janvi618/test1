import { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { STEPS_INFO, type MatrixItem } from '../types/workflow';

export default function Step5() {
  const { state, updateStep5, nextStep, prevStep } = useWorkflow();
  const stepInfo = STEPS_INFO[4];

  const [newOption, setNewOption] = useState('');
  const [newReco, setNewReco] = useState('');

  const addMatrixItem = () => {
    if (newOption.trim()) {
      const newItem: MatrixItem = {
        option: newOption.trim(),
        feasibility: 5,
        impact: 5,
        effort: 5,
        priority: 'medium',
      };
      updateStep5({ comparisonMatrix: [...state.step5.comparisonMatrix, newItem] });
      setNewOption('');
    }
  };

  const updateMatrixItem = (index: number, updates: Partial<MatrixItem>) => {
    const updated = state.step5.comparisonMatrix.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    );
    updateStep5({ comparisonMatrix: updated });
  };

  const removeMatrixItem = (index: number) => {
    updateStep5({
      comparisonMatrix: state.step5.comparisonMatrix.filter((_, i) => i !== index),
    });
  };

  const addRecommendation = () => {
    if (newReco.trim()) {
      updateStep5({ recommendations: [...state.step5.recommendations, newReco.trim()] });
      setNewReco('');
    }
  };

  const removeRecommendation = (index: number) => {
    updateStep5({
      recommendations: state.step5.recommendations.filter((_, i) => i !== index),
    });
  };

  const calculatePriority = (item: MatrixItem): 'high' | 'medium' | 'low' => {
    const score = (item.feasibility * 0.3) + (item.impact * 0.5) - (item.effort * 0.2);
    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
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
        <div className="form-section">
          <h3>Executive Summary</h3>
          <div className="form-group">
            <label>Summarize the work and key findings</label>
            <textarea
              value={state.step5.executiveSummary}
              onChange={(e) => updateStep5({ executiveSummary: e.target.value })}
              placeholder="Provide a high-level summary of the research and analysis conducted across all phases..."
              rows={6}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Comparison Matrix</h3>
          <p className="section-desc">Evaluate options with appropriate matrix comparison</p>

          <div className="list-input-group">
            <div className="list-input">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add an option to compare..."
                onKeyPress={(e) => e.key === 'Enter' && addMatrixItem()}
              />
              <button onClick={addMatrixItem}>Add Option</button>
            </div>
          </div>

          {state.step5.comparisonMatrix.length > 0 && (
            <div className="matrix-table">
              <table>
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Feasibility</th>
                    <th>Impact</th>
                    <th>Effort</th>
                    <th>Priority</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {state.step5.comparisonMatrix.map((item, index) => (
                    <tr key={index}>
                      <td className="option-name">{item.option}</td>
                      <td>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={item.feasibility}
                          onChange={(e) => {
                            const updates = { feasibility: parseInt(e.target.value) };
                            updateMatrixItem(index, { ...updates, priority: calculatePriority({ ...item, ...updates }) });
                          }}
                        />
                        <span className="score">{item.feasibility}</span>
                      </td>
                      <td>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={item.impact}
                          onChange={(e) => {
                            const updates = { impact: parseInt(e.target.value) };
                            updateMatrixItem(index, { ...updates, priority: calculatePriority({ ...item, ...updates }) });
                          }}
                        />
                        <span className="score">{item.impact}</span>
                      </td>
                      <td>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={item.effort}
                          onChange={(e) => {
                            const updates = { effort: parseInt(e.target.value) };
                            updateMatrixItem(index, { ...updates, priority: calculatePriority({ ...item, ...updates }) });
                          }}
                        />
                        <span className="score">{item.effort}</span>
                      </td>
                      <td>
                        <span className={`priority-badge priority-${item.priority}`}>
                          {item.priority.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button className="remove-btn" onClick={() => removeMatrixItem(index)}>&times;</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Technical Roadmap</h3>
          <div className="form-group">
            <label>Outline the technical roadmap and timeline</label>
            <textarea
              value={state.step5.technicalRoadmap}
              onChange={(e) => updateStep5({ technicalRoadmap: e.target.value })}
              placeholder="Define phases, milestones, dependencies, and timelines..."
              rows={5}
            />
          </div>
        </div>

        <div className="form-section output-section">
          <h3>Recommendations</h3>
          <div className="list-input-group">
            <div className="list-input">
              <input
                type="text"
                value={newReco}
                onChange={(e) => setNewReco(e.target.value)}
                placeholder="Add a recommendation..."
                onKeyPress={(e) => e.key === 'Enter' && addRecommendation()}
              />
              <button onClick={addRecommendation}>Add</button>
            </div>
            <ol className="recommendation-list">
              {state.step5.recommendations.map((reco, i) => (
                <li key={i}>
                  <span>{reco}</span>
                  <button className="remove-btn" onClick={() => removeRecommendation(i)}>&times;</button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Reference from Step 4 */}
        {state.step4.opportunities.length > 0 && (
          <div className="form-section reference-section">
            <h3>Reference: Analyzed Opportunities</h3>
            <div className="opportunities-summary">
              {state.step4.opportunities.map((opp) => (
                <div key={opp.id} className="opp-summary-card">
                  <h4>{opp.name}</h4>
                  <div className="opp-meta">
                    <span>TRL: {opp.techReadinessLevel}</span>
                    {opp.sizeOfPrize && <span>Prize: {opp.sizeOfPrize.substring(0, 50)}...</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={prevStep}>
          &larr; Back to Step 4
        </button>
        <button className="btn-primary" onClick={nextStep}>
          Continue to Step 6 &rarr;
        </button>
      </div>
    </div>
  );
}
