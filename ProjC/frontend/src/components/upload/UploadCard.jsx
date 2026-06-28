import { useRef, useState } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";

export default function UploadCard({ onAnalyze, disabled }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const validateAndSet = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setFileError("Only PDF bank statements are supported.");
      setSelectedFile(null);
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setFileError("File is too large (max 20 MB).");
      setSelectedFile(null);
      return;
    }
    setFileError(null);
    setSelectedFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    validateAndSet(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-card p-6 sm:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-semibold text-ink tracking-tight">Upload your statement</h2>
          <p className="text-sm text-muted mt-1">PDF bank statements only, up to 20 MB</p>
        </div>
        <span className="w-9 h-9 rounded-lg bg-accent-light text-accent flex items-center justify-center">
          <Icon name="file" className="w-5 h-5" />
        </span>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-200 ${
          isDragging ? "border-accent bg-accent-light" : "border-border bg-canvas"
        }`}
      >
        <div className="w-12 h-12 mx-auto rounded-full bg-white border border-border flex items-center justify-center mb-4 text-accent">
          <Icon name="upload" className="w-5 h-5" />
        </div>

        {selectedFile ? (
          <p className="text-sm font-medium text-ink">{selectedFile.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-ink">Drag and drop your PDF here</p>
            <p className="text-sm text-muted mt-1">or</p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => validateAndSet(e.target.files?.[0])}
        />

        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={() => inputRef.current?.click()}
        >
          Browse PDF
        </Button>
      </div>

      {fileError && (
        <p className="mt-3 text-sm text-red-600">{fileError}</p>
      )}

      <Button
        variant="primary"
        size="md"
        className="w-full mt-5"
        disabled={!selectedFile || disabled}
        onClick={() => onAnalyze(selectedFile)}
      >
        <Icon name="sparkles" className="w-4 h-4" />
        Upload &amp; Analyze
      </Button>
    </div>
  );
}
