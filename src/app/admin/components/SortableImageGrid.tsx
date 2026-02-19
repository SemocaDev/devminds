'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, Plus, Loader2, GripVertical } from 'lucide-react';

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
  folder: string;
};

function SortableItem({
  url,
  onRemove,
}: {
  url: string;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-700 group"
    >
      <Image
        src={url}
        alt="Project image"
        fill
        className="object-cover"
        sizes="128px"
      />
      {/* Handle de arrastre */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 w-7 h-7 bg-black/60 hover:bg-black/80 rounded flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4 text-white" />
      </div>
      {/* Botón eliminar */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 w-7 h-7 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}

export default function SortableImageGrid({ images, onChange, folder }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.indexOf(active.id as string);
      const newIndex = images.indexOf(over.id as string);
      onChange(arrayMove(images, oldIndex, newIndex));
    }
  }

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    setUploading(true);
    const newImages = [...images];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          newImages.push(data.url);
        }
      } catch {
        // Continuar con las demás imágenes
      }
    }

    onChange(newImages);
    setUploading(false);
  }, [images, folder, onChange]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items || uploading) return;
    const imageFiles: File[] = [];
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) imageFiles.push(file);
      }
    }
    if (imageFiles.length > 0) {
      e.preventDefault();
      uploadFiles(imageFiles);
    }
  }, [uploading, uploadFiles]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
    e.target.value = '';
  }

  function handleRemove(index: number) {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={images} strategy={rectSortingStrategy}>
          <div className="flex flex-wrap gap-3">
            {images.map((url, index) => (
              <SortableItem
                key={url}
                url={url}
                onRemove={() => handleRemove(index)}
              />
            ))}

            {/* Botón de agregar / drop zone */}
            <div
              onClick={() => !uploading && inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`w-32 h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-cyan-400 bg-cyan-500/10'
                  : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
              } ${uploading ? 'pointer-events-none' : ''}`}
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
              ) : (
                <>
                  <Plus className="w-6 h-6 text-gray-500 mb-1" />
                  <span className="text-xs text-gray-500">Agregar</span>
                </>
              )}
            </div>
          </div>
        </SortableContext>
      </DndContext>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <p className="text-xs text-gray-500">
        Arrastra, pega (Ctrl+V) o haz click para agregar. Máximo 5MB por imagen.
      </p>
    </div>
  );
}
