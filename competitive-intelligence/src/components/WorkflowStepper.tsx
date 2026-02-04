import { useWorkflow } from '../context/WorkflowContext';
import { STEPS_INFO } from '../types/workflow';

export default function WorkflowStepper() {
  const { state, goToStep } = useWorkflow();

  return (
    <div className="workflow-stepper">
      <div className="phase-labels">
        <div className="phase-label phase-1-label">
          <span>Phase 1</span>
          <small>Develop Strategy per Tech Competitive Intelligence</small>
        </div>
        <div className="phase-label phase-2-label">
          <span>Phase 2</span>
          <small>Build a "Sound" Technical Plan to Enable Growth Strategy</small>
        </div>
      </div>

      <div className="stepper-track">
        <div className="stepper-line"></div>
        <div
          className="stepper-progress"
          style={{ width: `${((state.currentStep - 1) / 5) * 100}%` }}
        ></div>

        {STEPS_INFO.map((step) => (
          <div
            key={step.number}
            className={`stepper-step ${state.currentStep === step.number ? 'active' : ''} ${state.currentStep > step.number ? 'completed' : ''} phase-${step.phase}`}
            onClick={() => goToStep(step.number)}
          >
            <div className="step-circle">
              {state.currentStep > step.number ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                step.number
              )}
            </div>
            <div className="step-label">
              <span className="step-number">Step {step.number}</span>
              <span className="step-title">{step.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
