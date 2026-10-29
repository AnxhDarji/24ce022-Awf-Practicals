import { useState } from 'react';

function Contact() {
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  return (
    <section className="contact-card">
      <h1>Contact Me</h1>
      <p>Send a short message below.</p>
      <label htmlFor="message">Your Message</label>
      <textarea
        id="message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type your message here..."
      />
      <p className="count">Character count: {message.length}</p>
      <p className="preview">Live preview: {message || 'Your message will appear here.'}</p>
      <button className="help-button" onClick={() => setShowHelp(!showHelp)}>
        {showHelp ? 'Hide Help' : 'Show Help'}
      </button>
      {showHelp && <p className="help-text">This is a controlled input: React state updates with every keystroke.</p>}
    </section>
  );
}

export default Contact;
