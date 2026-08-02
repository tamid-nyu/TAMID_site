import { STATUS_PAGE_URL } from '@constants';
import { InlineLink } from '@components/InlineLink';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  showStatusLink?: boolean;
}

export const ErrorDisplay = ({ error, onRetry, showStatusLink = true }: ErrorDisplayProps) => {
  const normalizedError = error.toLowerCase();
  const containsStatusReference =
    normalizedError.includes('status.nyu-sjba.org') ||
    normalizedError.includes('sjba service status') ||
    normalizedError.includes('service status') ||
    normalizedError.includes('platform status');

  const shouldShowStatusLink = showStatusLink && !containsStatusReference;

  return (
    <section className="error-display" role="alert" aria-live="polite">
      <div className="error-display__shell">
        <div className="error-display__content">
          <p className="error-display__eyebrow">Unable to Load</p>
          <h2 className="error-display__title">Something went wrong.</h2>
          <p className="error-display__message">{error}</p>
          {shouldShowStatusLink && (
            <p className="error-display__status">
              Check&nbsp;
              <InlineLink
                className="error-display__status-link"
                href={STATUS_PAGE_URL}
                target="_blank"
                rel="noreferrer"
                useArrow={false}
              >
                SJBA Service Status
              </InlineLink>
              &nbsp;for real-time updates.
            </p>
          )}
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
