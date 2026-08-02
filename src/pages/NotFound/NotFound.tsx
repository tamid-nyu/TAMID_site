import './NotFound.css';

export const NotFound = () => (
  <div className="page-container not-found-page">
    <section className="not-found-shell" aria-labelledby="not-found-title">
      <p className="not-found-eyebrow">404 error</p>
      <h1 id="not-found-title" className="not-found-title">
        Page not found.
      </h1>
      <p className="not-found-copy">The page may have moved or your link may be incorrect.</p>
    </section>
  </div>
);
