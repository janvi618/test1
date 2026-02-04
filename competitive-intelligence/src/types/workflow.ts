// Types for the Competitive Intelligence Workflow

export interface Step1Data {
  industry: string;
  company: string;
  publicAnnouncements: string;
  patents: string;
  maActivities: string;
  annualReports: string;
  secFilings: string;
  industryChanges: string;
  socialMediaSentiment: string;
  technicalLevers: string[];
  ipWhitespace: string[];
  consumerTrends: string[];
}

export interface Step2Data {
  ontologyResearchTree: string;
  ipCrowdedness: string;
  meceMindmap: string;
  e2eEcosystemMap: string;
  newEntrantAnalysis: string;
  innovationWhitespace: string[];
  priorityAreas: string[];
}

export interface Step3Data {
  fitAnalysis: string;
  rrwAnalysis: {
    isItReal: string;
    canWeWin: string;
    isItWorthIt: string;
  };
  newEntrantStrategy: string;
  selectedOpportunities: string[];
  internalStrategy: string;
  teamAlignment: string;
}

export interface Step4Data {
  opportunities: OpportunityAnalysis[];
}

export interface OpportunityAnalysis {
  id: string;
  name: string;
  jtbdAlignment: string;
  consumerNeeds: string[];
  techReadinessLevel: number;
  rwwAssessment: {
    real: string;
    win: string;
    worth: string;
  };
  sizeOfPrize: string;
}

export interface Step5Data {
  executiveSummary: string;
  comparisonMatrix: MatrixItem[];
  prioritizedOptions: string[];
  technicalRoadmap: string;
  recommendations: string[];
}

export interface MatrixItem {
  option: string;
  feasibility: number;
  impact: number;
  effort: number;
  priority: 'high' | 'medium' | 'low';
}

export interface Step6Data {
  insights: string[];
  strategy: string;
  recommendations: string[];
  nextSteps: string[];
  presentationNotes: string;
}

export interface WorkflowState {
  currentStep: number;
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;
  step6: Step6Data;
}

export type StepStatus = 'pending' | 'in_progress' | 'completed';

export interface StepInfo {
  number: number;
  title: string;
  phase: 1 | 2;
  tool: string;
  guardrails: string[];
}

export const STEPS_INFO: StepInfo[] = [
  {
    number: 1,
    title: 'Generate Category Landscape & Whitespace',
    phase: 1,
    tool: 'Deep Research',
    guardrails: ['Legal use', 'Ethical', 'GDPR', 'No IP invention'],
  },
  {
    number: 2,
    title: 'Review IP Ontology & IP Whitespace',
    phase: 1,
    tool: 'AI Refinement & Summary',
    guardrails: ['No IP invention'],
  },
  {
    number: 3,
    title: 'Develop Strategy to Align with Business Fit',
    phase: 1,
    tool: 'RRW Analysis',
    guardrails: [],
  },
  {
    number: 4,
    title: 'Dive into Each Chosen Opportunity',
    phase: 2,
    tool: 'Deep Research',
    guardrails: ['No IP invention'],
  },
  {
    number: 5,
    title: 'Synthesize Insights & Propose Program',
    phase: 2,
    tool: 'GenAI',
    guardrails: ['No IP invention'],
  },
  {
    number: 6,
    title: 'Strategy & Recommendations',
    phase: 2,
    tool: 'Presentation Tools',
    guardrails: [],
  },
];
