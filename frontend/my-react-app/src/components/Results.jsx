import React from 'react';

function Results({ result }) {
  if (result === null) {
    return <div>No prediction yet.</div>;
  }

  return (
    <div>
      <h2>Prediction Result</h2>
      <p>Your predicted score: <strong>{result}</strong></p>
    </div>
  );
}

export default Results;
