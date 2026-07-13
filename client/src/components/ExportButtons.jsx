import { useState } from "react";
import { exportReport } from "../services/api";

const ExportButtons = ({ token, reportType, filters }) => {
  const [loadingFormat, setLoadingFormat] = useState("");
  const [error, setError] = useState("");

  const handleExport = async (format) => {
    try {
      setLoadingFormat(format);
      setError("");

      const response = await exportReport(token, format, {
        reportType,
        ...filters,
      });

      const extension = format === "excel" ? "xlsx" : format;
      const fileUrl = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `${reportType}-report.${extension}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(fileUrl);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to export report");
    } finally {
      setLoadingFormat("");
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap gap-2">
        <button
          className="btn btn-outline-success"
          disabled={loadingFormat !== ""}
          onClick={() => handleExport("csv")}
        >
          {loadingFormat === "csv" ? "Exporting..." : "Export CSV"}
        </button>

        <button
          className="btn btn-outline-primary"
          disabled={loadingFormat !== ""}
          onClick={() => handleExport("excel")}
        >
          {loadingFormat === "excel" ? "Exporting..." : "Export Excel"}
        </button>

        <button
          className="btn btn-outline-danger"
          disabled={loadingFormat !== ""}
          onClick={() => handleExport("pdf")}
        >
          {loadingFormat === "pdf" ? "Exporting..." : "Export PDF"}
        </button>
      </div>

      {error && <div className="alert alert-danger mt-2 mb-0">{error}</div>}
    </div>
  );
};

export default ExportButtons;
