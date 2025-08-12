import React, { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: ''
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div style={{ display: 'flex', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <form style={{ flex: 1, marginRight: 20 }}>
        <h2>Resume Input</h2>
        <label>Name:<br />
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label><br /><br />
        <label>Email:<br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label><br /><br />
        <label>Phone:<br />
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
        </label><br /><br />
        <label>Summary:<br />
          <textarea name="summary" value={formData.summary} onChange={handleChange} rows={3} />
        </label><br /><br />
        <label>Experience:<br />
          <textarea name="experience" value={formData.experience} onChange={handleChange} rows={5} />
        </label><br /><br />
        <label>Education:<br />
          <textarea name="education" value={formData.education} onChange={handleChange} rows={4} />
        </label><br /><br />
        <label>Skills:<br />
          <textarea name="skills" value={formData.skills} onChange={handleChange} rows={3} />
        </label>
      </form>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: 20, borderRadius: 4, backgroundColor: '#f9f9f9' }}>
        <h2>Resume Preview</h2>
        <h1>{formData.name || 'Your Name'}</h1>
        <p><strong>Email:</strong> {formData.email || 'your.email@example.com'}</p>
        <p><strong>Phone:</strong> {formData.phone || '(123) 456-7890'}</p>
        <section>
          <h3>Summary</h3>
          <p>{formData.summary || 'Brief summary about yourself.'}</p>
        </section>
        <section>
          <h3>Experience</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{formData.experience || 'Your work experience details.'}</p>
        </section>
        <section>
          <h3>Education</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{formData.education || 'Your education details.'}</p>
        </section>
        <section>
          <h3>Skills</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{formData.skills || 'Your skills.'}</p>
        </section>
      </div>
    </div>
  );
}
