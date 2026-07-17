const statusBadgeClass = {
  Available: "bg-success",
  Assigned: "bg-primary",
  "Under Maintenance": "bg-warning text-dark",
  Retired: "bg-secondary",
};

const AssetTable = ({
  assets,
  isAdmin,
  onEdit,
  onDelete,
  onAssign,
  searchText,
  setSearchText,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  categories = [],
}) => {
  return (
    <div className="card p-3 mb-4">
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search name, code, or brand"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Asset Code</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand / Model</th>
              <th>Purchase Date</th>
              <th>Cost</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="text-center">
                  No assets found
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.asset_code}</td>
                  <td>{asset.asset_name}</td>
                  <td>{asset.asset_category}</td>
                  <td>
                    {asset.brand || "-"} {asset.model ? `/ ${asset.model}` : ""}
                  </td>
                  <td>{asset.purchase_date?.slice(0, 10)}</td>
                  <td>
                    ₹{Number(asset.purchase_cost || 0).toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        statusBadgeClass[asset.asset_status] || "bg-secondary"
                      }`}
                    >
                      {asset.asset_status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        {asset.asset_status === "Available" && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => onAssign(asset)}
                          >
                            Assign
                          </button>
                        )}

                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => onEdit(asset)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          disabled={asset.asset_status === "Assigned"}
                          title={
                            asset.asset_status === "Assigned"
                              ? "Return the asset before deleting"
                              : ""
                          }
                          onClick={() => onDelete(asset.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetTable;
