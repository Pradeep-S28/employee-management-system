import { useEffect, useState } from "react";

const initialForm = {
  training_title: "",
  description: "",
  category: "",
  duration_hours: "",
  trainer_name: "",
  start_date: "",
  end_date: "",
  status: "Upcoming",
};

const TrainingProgramForm = ({ onSubmit, editingProgram, onCancel }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingProgram) {
      setFormData({
        training_title: editingProgram.training_title || "",
        description: editingProgram.description || "",
        category: editingProgram.category || "",
        duration_hours: editingProgram.duration_hours || "",
        trainer_name: editingProgram.trainer_name || "",
        start_date: editingProgram.start_date?.slice(0, 10) || "",
        end_date: editingProgram.end_date?.slice(0, 10) || "",
        status: editingProgram.status || "Upcoming",
      });
    } else {
      setFormData(initialForm);
    }
    setErrors({});
  }, [editingProgram]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.training_title.trim())
      newErrors.training_title = "Training title is required";

    if (!formData.category.trim()) newErrors.category = "Category is required";

    if (!formData.duration_hours || Number(formData.duration_hours) <= 0)
      newErrors.duration_hours = "Duration must be greater than 0 hours";

    if (!formData.trainer_name.trim())
      newErrors.trainer_name = "Trainer name is required";

    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.end_date) newErrors.end_date = "End date is required";

    if (
      formData.start_date &&
      formData.end_date &&
      new Date(formData.end_date) <= new Date(formData.start_date)
    ) {
      newErrors.end_date = "End date must be later than the start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      onSubmit(formData);

      if (!editingProgram) {
        setFormData(initialForm);
      }

      setErrors({});
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h5>
        {editingProgram ? "Edit Training Program" : "Add Training Program"}
      </h5>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Training Title</label>
            <input
              type="text"
              name="training_title"
              className="form-control"
              value={formData.training_title}
              onChange={handleChange}
            />
            {errors.training_title && (
              <small className="text-danger">{errors.training_title}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Category</label>
            <input
              type="text"
              name="category"
              className="form-control"
              placeholder="e.g. Technical, Soft Skills, Compliance"
              value={formData.category}
              onChange={handleChange}
            />
            {errors.category && (
              <small className="text-danger">{errors.category}</small>
            )}
          </div>

          <div className="col-md-12">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows={2}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Duration (Hours)</label>
            <input
              type="number"
              min="1"
              name="duration_hours"
              className="form-control"
              value={formData.duration_hours}
              onChange={handleChange}
            />
            {errors.duration_hours && (
              <small className="text-danger">{errors.duration_hours}</small>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label">Trainer Name</label>
            <input
              type="text"
              name="trainer_name"
              className="form-control"
              value={formData.trainer_name}
              onChange={handleChange}
            />
            {errors.trainer_name && (
              <small className="text-danger">{errors.trainer_name}</small>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="start_date"
              className="form-control"
              value={formData.start_date}
              onChange={handleChange}
            />
            {errors.start_date && (
              <small className="text-danger">{errors.start_date}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="end_date"
              className="form-control"
              value={formData.end_date}
              onChange={handleChange}
            />
            {errors.end_date && (
              <small className="text-danger">{errors.end_date}</small>
            )}
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary" type="submit">
            {editingProgram ? "Update Program" : "Add Program"}
          </button>

          {editingProgram && (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TrainingProgramForm;
