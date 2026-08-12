import './ErrorDisplay.css';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  return (
    <section className="error-display" role="alert" aria-live="polite">
      <div className="error-display__shell">
        <div className="error-display__content">
          <p className="error-display__eyebrow">Unable to Load</p>
          <h2 className="error-display__title">Something went wrong.</h2>
          <p className="error-display__message">{error}</p>
          {onRetry && (
            <button className="error-display__retry" onClick={onRetry} type="button">
              Try Again
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
