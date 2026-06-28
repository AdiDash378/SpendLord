import { useCallback, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";

export default function UploadSlip({ onFileSelected, file, onClear, disabled }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) onFileSelected(dropped);
    },
    [onFileSelected, disabled]
  );

  const handleInputChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelected(selected);
  };

  if (file) {
    return (
      <div className="slip slip--filled">
        <div className="slip__file">
          <FileText size={20} strokeWidth={1.75} />
          <div className="slip__file-info">
            <span className="slip__file-name">{file.name}</span>
            <span className="slip__file-size">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>
        {!disabled && (
          <button
            type="button"
            className="slip__clear"
            onClick={onClear}
            aria-label="Remove file"
          >
            <X size={16} strokeWidth={2} />
          </button>
        )}
      </div>
    );
  }

  return (
    <label
      className={`slip ${isDragging ? "slip--dragging" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="application/pdf"
        onChange={handleInputChange}
        hidden
      />
      <UploadCloud size={28} strokeWidth={1.5} />
      <span className="slip__label">Drop your statement here</span>
      <span className="slip__sublabel">or click to browse — PDF, up to 20MB</span>
    </label>
  );
}
