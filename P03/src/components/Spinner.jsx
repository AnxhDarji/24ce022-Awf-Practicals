function Spinner() {
  return (
    <div className="status-card" role="status">
      <div className="spinner" aria-label="Loading repositories" />
      <p>Loading repositories...</p>
    </div>
  );
}

export default Spinner;
