import { useRef } from "react";
import { Upload } from "lucide-react";

export function FileUpload({
  accept = "image/*",
  onFileSelect,
  label = "Upload File",
  className = "",
}) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onFileSelect(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-input bg-muted/50 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all text-sm font-medium ${className}`}
    >
      <Upload size={16} />
      {label}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </button>
  );
}
