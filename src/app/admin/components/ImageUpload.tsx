'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
};

export default function ImageUpload({ value, onChange, folder }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Error al subir imagen');
        return;
      }

      const data = await res.json();
      onChange(data.url);
    } catch {
      alert('Error al subir imagen');
    } finally {
      setUploading(false);
    }
  }, [folder, onChange]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadFile(file);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    e.target.value = '';
  }

  function handleRemove() {
    onChange(null);
  }

  if (value) {
    return (
      <div className="relative w-40 h-40 rounded-xl overflow-hidden border-2 border-gray-700 group">
        <Image
          src={value}
          alt="Preview"
          fill
          className="object-cover"
          sizes="160px"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 w-7 h-7 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => !uploading && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`w-40 h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
        dragOver
          ? 'border-cyan-400 bg-cyan-500/10'
          : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
      } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
    >
      {uploading ? (
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      ) : (
        <>
          <Upload className="w-8 h-8 text-gray-500 mb-2" />
          <span className="text-xs text-gray-500 text-center px-2">
            Arrastra o haz click
          </span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
