import React, { useState } from 'react';

export default function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: ''
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <form style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2>Resume Input</h2>
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <textarea name="summary" placeholder="Professional Summary" value={form.summary} onChange={handleChange} rows={4} />
        <textarea name="experience" placeholder="Work Experience" value={form.experience} onChange={handleChange} rows={6} />
      </form>

      <section style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
        <h2>Resume Preview</h2>
        <h1>{form.name || 'Your Name'}</h1>
        <p><strong>Email:</strong> {form.email || 'your.email@example.com'}</p>
        <p><strong>Phone:</strong> {form.phone || '(123) 456-7890'}</p>
        <h3>Professional Summary</h3>
        <p>{form.summary || 'Brief summary about your professional background.'}</p>
        <h3>Work Experience</h3>
        <p style={{ whiteSpace: 'pre-wrap' }}>{form.experience || 'Describe your work experience here.'}</p>
      </section>
    </div>
  );
}
