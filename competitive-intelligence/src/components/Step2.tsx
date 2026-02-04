import { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { STEPS_INFO } from '../types/workflow';

export default function Step2() {
  const { state, updateStep2, nextStep, prevStep } = useWorkflow();
  const stepInfo = STEPS_INFO[1];
  const [newWhitespace, setNewWhitespace] = useState('');
  const [newPriority, setNewPriority] = useState('');

  const addToList = (
    list: string[],
    value: string,
    setter: (v: string) => void,
    updateKey: 'innovationWhitespace' | 'priorityAreas'
  ) => {
    if (value.trim()) {
      updateStep2({ [updateKey]: [...list, value.trim()] });
      setter('');
    }
  };

  const removeFromList = (
    list: string[],
    index: number,
    updateKey: 'innovationWhitespace' | 'priorityAreas'
  ) => {
    updateStep2({ [updateKey]: list.filter((_, i) => i !== index) });
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
          <h3>Analysis Tasks</h3>
          <p className="section-desc">Zoom into specific areas to elicit insights</p>

          <div className="form-group">
            <label>Ontology Research Tree</label>
            <textarea
              value={state.step2.ontologyResearchTree}
              onChange={(e) => updateStep2({ ontologyResearchTree: e.target.value })}
              placeholder="Map out the technology/concept hierarchy and relationships..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>IP Crowdedness Analysis</label>
            <textarea
              value={state.step2.ipCrowdedness}
              onChange={(e) => updateStep2({ ipCrowdedness: e.target.value })}
              placeholder="Analyze patent density and competition in different areas..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>MECE Mindmap</label>
            <textarea
              value={state.step2.meceMindmap}
              onChange={(e) => updateStep2({ meceMindmap: e.target.value })}
              placeholder="Mutually Exclusive, Collectively Exhaustive breakdown of the space..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>E2E Ecosystem Map</label>
            <textarea
              value={state.step2.e2eEcosystemMap}
              onChange={(e) => updateStep2({ e2eEcosystemMap: e.target.value })}
              placeholder="End-to-end ecosystem analysis: suppliers, partners, customers..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>What Would a New Entrant Do?</label>
            <textarea
              value={state.step2.newEntrantAnalysis}
              onChange={(e) => updateStep2({ newEntrantAnalysis: e.target.value })}
              placeholder="If a new player entered this space, what approach would they take?"
              rows={4}
            />
          </div>
        </div>

        <div className="form-section output-section">
          <h3>Outputs</h3>
          <p className="section-desc">Innovation white space for internal prioritization</p>

          <div className="list-input-group">
            <label>Innovation Whitespace Areas</label>
            <div className="list-input">
              <input
                type="text"
                value={newWhitespace}
                onChange={(e) => setNewWhitespace(e.target.value)}
                placeholder="Add innovation whitespace area..."
                onKeyPress={(e) => e.key === 'Enter' && addToList(state.step2.innovationWhitespace, newWhitespace, setNewWhitespace, 'innovationWhitespace')}
              />
              <button onClick={() => addToList(state.step2.innovationWhitespace, newWhitespace, setNewWhitespace, 'innovationWhitespace')}>Add</button>
            </div>
            <ul className="tag-list">
              {state.step2.innovationWhitespace.map((item, i) => (
                <li key={i} className="tag">
                  {item}
                  <button onClick={() => removeFromList(state.step2.innovationWhitespace, i, 'innovationWhitespace')}>&times;</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="list-input-group">
            <label>Priority Areas for Internal Review</label>
            <div className="list-input">
              <input
                type="text"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                placeholder="Add priority area..."
                onKeyPress={(e) => e.key === 'Enter' && addToList(state.step2.priorityAreas, newPriority, setNewPriority, 'priorityAreas')}
              />
              <button onClick={() => addToList(state.step2.priorityAreas, newPriority, setNewPriority, 'priorityAreas')}>Add</button>
            </div>
            <ul className="tag-list">
              {state.step2.priorityAreas.map((item, i) => (
                <li key={i} className="tag tag-priority">
                  {item}
                  <button onClick={() => removeFromList(state.step2.priorityAreas, i, 'priorityAreas')}>&times;</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Show data from Step 1 for reference */}
        {(state.step1.ipWhitespace.length > 0 || state.step1.technicalLevers.length > 0) && (
          <div className="form-section reference-section">
            <h3>Reference from Step 1</h3>
            {state.step1.ipWhitespace.length > 0 && (
              <div className="reference-list">
                <strong>IP Whitespace:</strong>
                <ul className="tag-list">
                  {state.step1.ipWhitespace.map((item, i) => (
                    <li key={i} className="tag tag-reference">{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {state.step1.technicalLevers.length > 0 && (
              <div className="reference-list">
                <strong>Technical Levers:</strong>
                <ul className="tag-list">
                  {state.step1.technicalLevers.map((item, i) => (
                    <li key={i} className="tag tag-reference">{item}</li>
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
