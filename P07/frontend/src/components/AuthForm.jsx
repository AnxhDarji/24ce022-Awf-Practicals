import { useState } from 'react';
import { login, register } from '../api';

function AuthForm({ onAuthenticated }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isRegistering) {
        await register({ email, password });
      }
      const result = await login({ email, password });
      onAuthenticated(result.token);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="task-form auth-form" onSubmit={handleSubmit}>
      <h2>{isRegistering ? 'Create an Account' : 'Log In'}</h2>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        minLength={isRegistering ? 6 : undefined}
        required
      />
      <div className="form-actions">
        <button disabled={saving}>{saving ? 'Please wait...' : isRegistering ? 'Register' : 'Log In'}</button>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            setError('');
            setIsRegistering((current) => !current);
          }}
        >
          {isRegistering ? 'Use existing account' : 'Create account'}
        </button>
      </div>
    </form>
  );
}

export default AuthForm;
