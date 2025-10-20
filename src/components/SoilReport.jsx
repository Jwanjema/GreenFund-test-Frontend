import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

// --- Form for Manual Entry ---
function ManualEntryForm({ farm, onReportAdded }) {
  // --- THIS IS THE FIX ---
  // Added the missing '=' sign
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ----------------------
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    ph: 7.0,
    nitrogen: 20,
    phosphorus: 30,
    potassium: 150,
    moisture: 40,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const newReportData = { farm_id: farm.id, ...formData };
      const response = await apiClient.post('/soil/manual', newReportData);
      onReportAdded(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-background p-6 rounded-lg space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-text-secondary">Soil pH (0-14)</label>
        <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} className="w-full p-2 border rounded mt-1" disabled={isSubmitting} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary">Nitrogen (N) (ppm)</label>
        <input type="number" step="1" name="nitrogen" value={formData.nitrogen} onChange={handleChange} className="w-full p-2 border rounded mt-1" disabled={isSubmitting} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary">Phosphorus (P) (ppm)</label>
        <input type="number" step="1" name="phosphorus" value={formData.phosphorus} onChange={handleChange} className="w-full p-2 border rounded mt-1" disabled={isSubmitting} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary">Potassium (K) (ppm)</label>
        <input type="number" step="1" name="potassium" value={formData.potassium} onChange={handleChange} className="w-full p-2 border rounded mt-1" disabled={isSubmitting} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary">Moisture (%)</label>
        <input type="number" step="1" name="moisture" value={formData.moisture} onChange={handleChange} className="w-full p-2 border rounded mt-1" disabled={isSubmitting} />
      </div>
      <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400" disabled={isSubmitting}>
        {isSubmitting ? 'Analyzing...' : 'Analyze Soil'}
      </button>
    </form>
  );
}

// --- Form for Image Upload ---
function ImageUploadForm({ farm, onReportAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image file first.");
      return;
    }
    setError('');
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Use the new, unique path here
      const response = await apiClient.post(`/soil/upload_soil_image/${farm.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onReportAdded(response.data);
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to analyze image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-background p-6 rounded-lg space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-text-secondary">Upload Soil Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded mt-1"
          disabled={isSubmitting}
        />
      </div>
      {preview && (
        <div className="text-center">
          <img src={preview} alt="Soil preview" className="max-h-60 rounded-lg mx-auto" />
        </div>
      )}
      <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400" disabled={isSubmitting || !file}>
        {isSubmitting ? 'Analyzing Image...' : 'Analyze Soil Image'}
      </button>
    </form>
  );
}

// --- Main SoilReport Component ---
function SoilReport({ farm }) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('manual');

  useEffect(() => {
    if (!farm.id) return;

    const fetchReports = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await apiClient.get(`/soil/farm/${farm.id}`);
        setReports(response.data);
      } catch (err) {
          setError("Could not load past reports.");
          console.error("Failed to fetch soil reports:", err);
          setReports([]); // Ensure reports is an array even on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [farm.id]);

  const handleReportAdded = (newReport) => {
     if (newReport && newReport.ai_analysis_text !== undefined) {
         setReports([newReport, ...reports]);
     } else {
         console.log("Received confirmation or unexpected response:", newReport);
     }
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* --- LEFT SIDE: Input Forms with Tabs --- */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">New Soil Test</h2>
          {/* Tab Headers */}
          <div className="flex mb-4">
            <button
              className={`py-2 px-4 font-semibold ${activeTab === 'manual' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}
              onClick={() => setActiveTab('manual')}
            >
              Enter Manually
            </button>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === 'image' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}
              onClick={() => setActiveTab('image')}
            >
              Upload Image
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'manual' && <ManualEntryForm farm={farm} onReportAdded={handleReportAdded} />}
            {activeTab === 'image' && <ImageUploadForm farm={farm} onReportAdded={handleReportAdded} />}
          </div>
        </div>

        {/* --- RIGHT SIDE: Past Reports --- */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Past Reports</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <p>Loading reports...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : reports.length > 0 ? (
              reports.map((report) => (
                <div key={report.id || report.date} className="bg-background p-4 rounded-lg">
                  <p className="font-bold text-text-primary">
                    Report from: {new Date(report.date).toLocaleDateString()}
                  </p>

                  <div className="mt-2 p-3 bg-surface rounded">
                    <p className="font-semibold text-text-primary">AI Analysis:</p>
                    <p className="text-text-secondary text-sm mt-1">
                        {report.ai_analysis_text || "Analysis not available"}
                    </p>
                  </div>

                  <div className="mt-2 p-3 bg-surface rounded">
                    <p className="font-semibold text-text-primary">Suggested Crops:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(report.suggested_crops && Array.isArray(report.suggested_crops)) ? (
                        report.suggested_crops.map((crop, index) => (
                          <span key={index} className="text-xs bg-secondary text-white px-2 py-0.5 rounded-full">
                            {crop}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-text-secondary italic">
                          No crops suggested
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <p className="text-text-secondary">No soil reports submitted for this farm yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SoilReport;