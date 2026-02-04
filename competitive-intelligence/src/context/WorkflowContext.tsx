import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type {
  WorkflowState,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  Step5Data,
  Step6Data,
} from '../types/workflow';

// Initial state
const initialStep1: Step1Data = {
  industry: '',
  company: '',
  publicAnnouncements: '',
  patents: '',
  maActivities: '',
  annualReports: '',
  secFilings: '',
  industryChanges: '',
  socialMediaSentiment: '',
  technicalLevers: [],
  ipWhitespace: [],
  consumerTrends: [],
};

const initialStep2: Step2Data = {
  ontologyResearchTree: '',
  ipCrowdedness: '',
  meceMindmap: '',
  e2eEcosystemMap: '',
  newEntrantAnalysis: '',
  innovationWhitespace: [],
  priorityAreas: [],
};

const initialStep3: Step3Data = {
  fitAnalysis: '',
  rrwAnalysis: {
    isItReal: '',
    canWeWin: '',
    isItWorthIt: '',
  },
  newEntrantStrategy: '',
  selectedOpportunities: [],
  internalStrategy: '',
  teamAlignment: '',
};

const initialStep4: Step4Data = {
  opportunities: [],
};

const initialStep5: Step5Data = {
  executiveSummary: '',
  comparisonMatrix: [],
  prioritizedOptions: [],
  technicalRoadmap: '',
  recommendations: [],
};

const initialStep6: Step6Data = {
  insights: [],
  strategy: '',
  recommendations: [],
  nextSteps: [],
  presentationNotes: '',
};

const initialState: WorkflowState = {
  currentStep: 1,
  step1: initialStep1,
  step2: initialStep2,
  step3: initialStep3,
  step4: initialStep4,
  step5: initialStep5,
  step6: initialStep6,
};

// Action types
type Action =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_STEP1'; payload: Partial<Step1Data> }
  | { type: 'UPDATE_STEP2'; payload: Partial<Step2Data> }
  | { type: 'UPDATE_STEP3'; payload: Partial<Step3Data> }
  | { type: 'UPDATE_STEP4'; payload: Partial<Step4Data> }
  | { type: 'UPDATE_STEP5'; payload: Partial<Step5Data> }
  | { type: 'UPDATE_STEP6'; payload: Partial<Step6Data> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET' };

// Reducer
function workflowReducer(state: WorkflowState, action: Action): WorkflowState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_STEP1':
      return { ...state, step1: { ...state.step1, ...action.payload } };
    case 'UPDATE_STEP2':
      return { ...state, step2: { ...state.step2, ...action.payload } };
    case 'UPDATE_STEP3':
      return { ...state, step3: { ...state.step3, ...action.payload } };
    case 'UPDATE_STEP4':
      return { ...state, step4: { ...state.step4, ...action.payload } };
    case 'UPDATE_STEP5':
      return { ...state, step5: { ...state.step5, ...action.payload } };
    case 'UPDATE_STEP6':
      return { ...state, step6: { ...state.step6, ...action.payload } };
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 6) };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Context
interface WorkflowContextType {
  state: WorkflowState;
  dispatch: React.Dispatch<Action>;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateStep1: (data: Partial<Step1Data>) => void;
  updateStep2: (data: Partial<Step2Data>) => void;
  updateStep3: (data: Partial<Step3Data>) => void;
  updateStep4: (data: Partial<Step4Data>) => void;
  updateStep5: (data: Partial<Step5Data>) => void;
  updateStep6: (data: Partial<Step6Data>) => void;
  reset: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

// Provider
export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  const goToStep = (step: number) => dispatch({ type: 'SET_STEP', payload: step });
  const nextStep = () => dispatch({ type: 'NEXT_STEP' });
  const prevStep = () => dispatch({ type: 'PREV_STEP' });
  const updateStep1 = (data: Partial<Step1Data>) => dispatch({ type: 'UPDATE_STEP1', payload: data });
  const updateStep2 = (data: Partial<Step2Data>) => dispatch({ type: 'UPDATE_STEP2', payload: data });
  const updateStep3 = (data: Partial<Step3Data>) => dispatch({ type: 'UPDATE_STEP3', payload: data });
  const updateStep4 = (data: Partial<Step4Data>) => dispatch({ type: 'UPDATE_STEP4', payload: data });
  const updateStep5 = (data: Partial<Step5Data>) => dispatch({ type: 'UPDATE_STEP5', payload: data });
  const updateStep6 = (data: Partial<Step6Data>) => dispatch({ type: 'UPDATE_STEP6', payload: data });
  const reset = () => dispatch({ type: 'RESET' });

  return (
    <WorkflowContext.Provider
      value={{
        state,
        dispatch,
        goToStep,
        nextStep,
        prevStep,
        updateStep1,
        updateStep2,
        updateStep3,
        updateStep4,
        updateStep5,
        updateStep6,
        reset,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

// Hook
export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}
