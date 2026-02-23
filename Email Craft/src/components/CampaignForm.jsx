import React, { useState } from 'react';

const CampaignForm = ({ onGenerate, isGenerating }) => {
    const [formData, setFormData] = useState({
        goal: '',
        audience: '',
        tone: 'Professional',
        points: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerate(formData);
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Campaign Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label" htmlFor="goal">Campaign Goal</label>
                    <input
                        type="text"
                        id="goal"
                        name="goal"
                        className="glass-input"
                        placeholder="e.g. Promote Winter Sale"
                        value={formData.goal}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="label" htmlFor="audience">Target Audience</label>
                    <input
                        type="text"
                        id="audience"
                        name="audience"
                        className="glass-input"
                        placeholder="e.g. Small Business Owners"
                        value={formData.audience}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="label" htmlFor="tone">Tone of Voice</label>
                    <select
                        id="tone"
                        name="tone"
                        className="glass-input"
                        value={formData.tone}
                        onChange={handleChange}
                    >
                        <option value="Professional">Professional</option>
                        <option value="Witty">Witty</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Friendly">Friendly</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="label" htmlFor="points">Key Points (Optional)</label>
                    <textarea
                        id="points"
                        name="points"
                        className="glass-input"
                        rows="4"
                        placeholder="Enter key points to include, one per line..."
                        value={formData.points}
                        onChange={handleChange}
                        style={{ resize: 'vertical' }}
                    />
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', marginTop: '1rem' }}
                    disabled={isGenerating}
                >
                    {isGenerating ? 'Generating Magic...' : 'Generate Campaign'}
                </button>
            </form>
        </div>
    );
};

export default CampaignForm;
