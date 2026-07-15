import { useState } from "react";
import { addPerformanceKpi } from "../services/api";

const KPIForm = ({ reviewId, token, onKpiAdded }) => {
  const [formData, setFormData] = useState({
    kpi_name: "",
    kpi_score: "",
    remarks: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setError("");
  };

  const validate = () => {
    if (!formData.kpi_name.trim()) {
      setError("KPI name is required");
      return false;
    }

    if (!formData.kpi_score) {
      setError("KPI score is required");
      return false;
    }

    if (Number(formData.kpi_score) < 1 || Number(formData.kpi_score) > 5) {
      setError("KPI score must be between 1 and 5");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await addPerformanceKpi(
        {
          review_id: reviewId,
          kpi_name: formData.kpi_name,
          kpi_score: Number(formData.kpi_score),
          remarks: formData.remarks,
        },
        token,
      );

      setFormData({ kpi_name: "", kpi_score: "", remarks: "" });

      if (onKpiAdded) onKpiAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add KPI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-2 align-items-end">
      {error && (
        <div className="col-12">
          <div className="alert alert-danger py-2 mb-2">{error}</div>
        </div>
      )}

      <div className="col-md-5">
        <label className="form-label">KPI Name</label>
        <input
          type="text"
          name="kpi_name"
          className="form-control"
          placeholder="Example: Code Quality"
          value={formData.kpi_name}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-2">
        <label className="form-label">Score</label>
        <select
          name="kpi_score"
          className="form-select"
          value={formData.kpi_score}
          onChange={handleChange}
        >
          <option value="">-</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div className="col-md-4">
        <label className="form-label">Remarks</label>
        <input
          type="text"
          name="remarks"
          className="form-control"
          placeholder="Optional remarks"
          value={formData.remarks}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-1">
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "..." : "Add"}
        </button>
      </div>
    </form>
  );
};

export default KPIForm;
