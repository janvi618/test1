import { WorkflowProvider, useWorkflow } from './context/WorkflowContext';
import { Step1, Step2, Step3, Step4, Step5, Step6, WorkflowStepper } from './components';
import './App.css';

function WorkflowContent() {
  const { state } = useWorkflow();

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 />;
      case 6:
        return <Step6 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Agent-Powered Tech Competitive Intelligence Workflow</h1>
        <p className="subtitle">A structured approach to developing competitive intelligence strategy</p>
      </header>

      <WorkflowStepper />

      <main className="app-main">
        {renderStep()}
      </main>

      <footer className="app-footer">
        <p>Competitive Intelligence Workflow Tool</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <WorkflowProvider>
      <WorkflowContent />
    </WorkflowProvider>
  );
}

export default App;
