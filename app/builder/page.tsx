'use client';

// Link Builder - Create tracking URLs with a simple form
import { useState } from 'react';

export default function LinkBuilder() {
  const [formData, setFormData] = useState({
    client: '',
    service: '',
    industry: '',
    channel: '',
    campaign: '',
    dest: ''
  });

  const [generatedURL, setGeneratedURL] = useState('');
  const [copied, setCopied] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Generate the tracking URL
  const generateURL = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.client || !formData.service || !formData.industry || !formData.channel || !formData.dest) {
      alert('Please fill in all required fields');
      return;
    }

    // Build URL parameters
    const params = new URLSearchParams();
    params.set('client', formData.client.trim());
    params.set('service', formData.service.trim());
    params.set('industry', formData.industry.trim());
    params.set('channel', formData.channel.trim());
    
    if (formData.campaign.trim()) {
      params.set('campaign', formData.campaign.trim());
    }
    
    params.set('dest', formData.dest.trim());

    // Generate full URL (use current host)
    const baseURL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';
    const trackingURL = `${baseURL}/api/r?${params.toString()}`;
    
    setGeneratedURL(trackingURL);
    setCopied(false);
  };

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generatedURL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Test the generated URL
  const testURL = () => {
    if (generatedURL) {
      window.open(generatedURL, '_blank');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔗 Link Builder</h1>
          <p className="text-gray-600 mb-8">Create tracking links for your affiliate campaigns</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
              <form onSubmit={generateURL} className="space-y-6">
                <div>
                  <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
                    Client * <span className="text-gray-500">(e.g., superboats)</span>
                  </label>
                  <input
                    type="text"
                    id="client"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    placeholder="superboats"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Service * <span className="text-gray-500">(e.g., boat-trip-lisbon)</span>
                  </label>
                  <input
                    type="text"
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    placeholder="boat-trip-lisbon"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                    Industry * <span className="text-gray-500">(e.g., boats, automotive)</span>
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select industry...</option>
                    <option value="boats">Boats</option>
                    <option value="automotive">Automotive</option>
                    <option value="travel">Travel</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="fitness">Fitness</option>
                    <option value="education">Education</option>
                    <option value="technology">Technology</option>
                    <option value="fashion">Fashion</option>
                    <option value="food">Food & Beverage</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="channel" className="block text-sm font-medium text-gray-700 mb-2">
                    Channel * <span className="text-gray-500">(where traffic comes from)</span>
                  </label>
                  <select
                    id="channel"
                    name="channel"
                    value={formData.channel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select channel...</option>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="pinterest">Pinterest</option>
                    <option value="snapchat">Snapchat</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="telegram">Telegram</option>
                    <option value="blog">Blog</option>
                    <option value="podcast">Podcast</option>
                    <option value="newsletter">Newsletter</option>
                    <option value="affiliate">Affiliate Network</option>
                    <option value="influencer">Influencer</option>
                    <option value="direct">Direct</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="campaign" className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign <span className="text-gray-500">(optional, e.g., summer-2024)</span>
                  </label>
                  <input
                    type="text"
                    id="campaign"
                    name="campaign"
                    value={formData.campaign}
                    onChange={handleChange}
                    placeholder="summer-2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="dest" className="block text-sm font-medium text-gray-700 mb-2">
                    Destination URL * <span className="text-gray-500">(where users will be redirected)</span>
                  </label>
                  <input
                    type="url"
                    id="dest"
                    name="dest"
                    value={formData.dest}
                    onChange={handleChange}
                    placeholder="https://example.com/landing-page"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
                >
                  🚀 Generate Tracking Link
                </button>
              </form>
            </div>

            {/* Result Section */}
            <div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Tracking Link</h3>
                
                {generatedURL ? (
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-md p-4">
                      <p className="text-sm text-gray-600 mb-2">Your tracking link:</p>
                      <code className="text-sm break-all bg-gray-100 p-2 rounded block">
                        {generatedURL}
                      </code>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={copyToClipboard}
                        className={`flex-1 py-2 px-4 rounded-md font-medium ${
                          copied 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                      >
                        {copied ? '✓ Copied!' : '📋 Copy Link'}
                      </button>
                      
                      <button
                        onClick={testURL}
                        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 font-medium"
                      >
                        🧪 Test Link
                      </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <p className="text-sm text-blue-800">
                        <strong>💡 Tip:</strong> This link will track clicks and redirect users to your destination. 
                        Check the <a href="/admin" className="underline">Admin Dashboard</a> to see click statistics.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Fill out the form and click "Generate" to create your tracking link</p>
                    <div className="mt-4 text-4xl">🔗</div>
                  </div>
                )}
              </div>

              {/* Quick Examples */}
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">📝 Quick Examples:</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Boat Tour:</strong> client=superboats, service=sunset-cruise, industry=boats, channel=tiktok
                  </div>
                  <div>
                    <strong>Car Rental:</strong> client=luxurycars, service=ferrari-rental, industry=automotive, channel=instagram
                  </div>
                  <div>
                    <strong>Hotel:</strong> client=grandhotel, service=weekend-package, industry=hospitality, channel=email
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between">
              <a href="/" className="text-blue-600 hover:text-blue-700">← Back to Home</a>
              <a href="/admin" className="text-blue-600 hover:text-blue-700">View Statistics →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
