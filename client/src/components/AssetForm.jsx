import { useEffect, useState } from "react";

const initialForm = {
  asset_name: "",
  asset_category: "",
  asset_code: "",
  brand: "",
  model: "",
  purchase_date: "",
  purchase_cost: "",
  warranty_expiry_date: "",
  asset_status: "Available",
};

const categories = [
  "Laptop",
  "Mobile",
  "Monitor",
  "Printer",
  "Accessory",
  "Furniture",
  "Other",
];

const AssetForm = ({ onSubmit, editingAsset, onCancel }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingAsset) {
      setFormData({
        asset_name: editingAsset.asset_name || "",
        asset_category: editingAsset.asset_category || "",
        asset_code: editingAsset.asset_code || "",
        brand: editingAsset.brand || "",
        model: editingAsset.model || "",
        purchase_date: editingAsset.purchase_date?.slice(0, 10) || "",
        purchase_cost: editingAsset.purchase_cost || "",
        warranty_expiry_date:
          editingAsset.warranty_expiry_date?.slice(0, 10) || "",
        asset_status: editingAsset.asset_status || "Available",
      });
    } else {
      setFormData(initialForm);
    }
    setErrors({});
  }, [editingAsset]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.asset_name.trim()) {
      newErrors.asset_name = "Asset name is required";
    }

    if (!formData.asset_category.trim()) {
      newErrors.asset_category = "Asset category is required";
    }

    if (!formData.asset_code.trim()) {
      newErrors.asset_code = "Asset code is required";
    }

    if (!formData.purchase_date) {
      newErrors.purchase_date = "Purchase date is required";
    }

    if (
      formData.purchase_cost !== "" &&
      Number(formData.purchase_cost) < 0
    ) {
      newErrors.purchase_cost = "Purchase cost cannot be negative";
    }

    if (
      formData.warranty_expiry_date &&
      formData.purchase_date &&
      formData.warranty_expiry_date < formData.purchase_date
    ) {
      newErrors.warranty_expiry_date =
        "Warranty expiry cannot be before purchase date";
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

      if (!editingAsset) {
        setFormData(initialForm);
      }

      setErrors({});
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h5>{editingAsset ? "Edit Asset" : "Add New Asset"}</h5>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Asset Name</label>
            <input
              type="text"
              name="asset_name"
              className="form-control"
              value={formData.asset_name}
              onChange={handleChange}
            />
            {errors.asset_name && (
              <small className="text-danger">{errors.asset_name}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Asset Category</label>
            <select
              name="asset_category"
              className="form-select"
              value={formData.asset_category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.asset_category && (
              <small className="text-danger">{errors.asset_category}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Asset Code</label>
            <input
              type="text"
              name="asset_code"
              className="form-control"
              placeholder="e.g. AST-LAP-002"
              value={formData.asset_code}
              onChange={handleChange}
            />
            {errors.asset_code && (
              <small className="text-danger">{errors.asset_code}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Brand</label>
            <input
              type="text"
              name="brand"
              className="form-control"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Model</label>
            <input
              type="text"
              name="model"
              className="form-control"
              value={formData.model}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Purchase Date</label>
            <input
              type="date"
              name="purchase_date"
              className="form-control"
              value={formData.purchase_date}
              onChange={handleChange}
            />
            {errors.purchase_date && (
              <small className="text-danger">{errors.purchase_date}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Purchase Cost (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="purchase_cost"
              className="form-control"
              value={formData.purchase_cost}
              onChange={handleChange}
            />
            {errors.purchase_cost && (
              <small className="text-danger">{errors.purchase_cost}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Warranty Expiry Date</label>
            <input
              type="date"
              name="warranty_expiry_date"
              className="form-control"
              value={formData.warranty_expiry_date}
              onChange={handleChange}
            />
            {errors.warranty_expiry_date && (
              <small className="text-danger">
                {errors.warranty_expiry_date}
              </small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Asset Status</label>
            <select
              name="asset_status"
              className="form-select"
              value={formData.asset_status}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
            <small className="text-muted">
              Use Assign/Return actions to move an asset in or out of
              &quot;Assigned&quot; status.
            </small>
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary" type="submit">
            {editingAsset ? "Update Asset" : "Add Asset"}
          </button>

          {editingAsset && (
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

export default AssetForm;
