import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import { cn } from '../shared/utils.ts';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label, className }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large (max 5MB)');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    setError(null);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onChange(response.data.url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error uploading image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
          {label}
        </label>
      )}
      
      <div className="flex flex-col gap-4">
        {value ? (
          <div className="relative group w-full aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white text-black rounded-full hover:bg-zinc-200 transition-colors"
                title="Change Image"
              >
                <Upload size={18} />
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Remove Image"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full aspect-video rounded-2xl border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center gap-3 text-zinc-500 hover:text-emerald-500 group disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 size={32} className="animate-spin" />
            ) : (
              <>
                <div className="p-3 rounded-full bg-zinc-900 group-hover:bg-emerald-500/10 transition-colors">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold">Click to upload</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-60">JPG, PNG, WEBP, SVG (MAX 5MB)</p>
                </div>
              </>
            )}
          </button>
        )}

        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500">
              <ImageIcon size={16} />
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Or paste image URL..."
              className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-[10px] text-red-500 ml-1">{error}</p>}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
