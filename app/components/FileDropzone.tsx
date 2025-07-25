import { useRef } from "react";
import { FileText, File, UploadCloud } from "lucide-react";

interface FileDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

export default function FileDropzone({ file, onFileChange, disabled }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 bg-card hover:bg-muted transition-colors min-w-[260px] min-h-[80px] w-full ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
      onDrop={handleDrop}
      onDragOver={e => { if (!disabled) e.preventDefault(); }}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      {!file ? (
        <div className="flex flex-col items-center gap-2">
          <UploadCloud size={28} className="text-gray-400" />
          <span className="text-sm text-muted-foreground">Klik atau drag file ke sini untuk mengunggah</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {file.name.endsWith(".pdf") ? (
            <FileText size={22} className="text-red-500" />
          ) : (
            <File size={22} className="text-blue-500" />
          )}
          <span className="text-sm truncate max-w-[180px]">{file.name}</span>
        </div>
      )}
    </div>
  );
} 