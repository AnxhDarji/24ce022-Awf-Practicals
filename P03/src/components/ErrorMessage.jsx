function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status-card error-message" role="alert">
      <h2>Unable to load repositories</h2>
      <p>{message}</p>
      <button onClick={onRetry}>Try Again</button>
    </div>
  );
}

export default ErrorMessage;
