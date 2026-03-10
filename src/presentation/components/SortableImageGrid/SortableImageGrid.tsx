/**
 * SortableImageGrid — RF19/RF20
 *
 * Grid de imágenes/videos con drag-and-drop para reordenar.
 * Usa @dnd-kit/sortable para arrastrar y soltar.
 * La primera imagen/video se convierte en la foto principal.
 * Click en un media abre un lightbox a pantalla completa.
 */

import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./sortableImageGrid.css";

/** Detectar si una URL es un video (blob de video o URL terminada en .mp4) */
function isVideoUrl(url: string): boolean {
  if (url.startsWith("blob:")) {
    // No podemos saber el tipo sólo por la URL de blob, así que pasamos el flag
    return false; // se gestiona por el map de { url, isVideo }
  }
  return url.includes(".mp4") || url.includes("video/");
}

interface MediaItem {
  url: string;
  isVideo: boolean;
}

interface SortableImageGridProps {
  previews: string[];
  onReorder: (newOrder: string[]) => void;
  onRemove: (index: number) => void;
  /** Permite al padre indicar cuáles URLs son videos (por índice) */
  videoFlags?: boolean[];
}

/** Tarjeta individual de media sorteable */
function SortableMedia({
  item,
  index,
  onRemove,
  onExpand,
}: {
  item: MediaItem;
  index: number;
  onRemove: (i: number) => void;
  onExpand: (item: MediaItem) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.url });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const isVideo = url.toLowerCase().includes(".mp4") || url.toLowerCase().includes("/video/");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-img-item ${isDragging ? "sortable-img-item--dragging" : ""}`}
      onClick={() => onExpand(item)}
    >
      {/* Handle de drag */}
      <div
        className="sortable-img-item__drag"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="5" r="1.5" />
          <circle cx="15" cy="5" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="19" r="1.5" />
          <circle cx="15" cy="19" r="1.5" />
        </svg>
      </div>

      {/* Media: imagen o miniatura de video */}
      {item.isVideo ? (
        <div className="sortable-img-item__video-thumb">
          <video
            src={item.url}
            className="sortable-img-item__img"
            muted
            playsInline
            preload="metadata"
          />
          {/* Ícono de play centrado */}
          <div className="sortable-img-item__play-icon">
            <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
              <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)" />
              <polygon points="9,7 19,12 9,17" fill="white" />
            </svg>
          </div>
        </div>
      ) : (
        <img
          src={item.url}
          alt={`Foto ${index + 1}`}
          className="sortable-img-item__img"
        />
      )}

      {index === 0 && (
        <span className="sortable-img-item__badge">
          {item.isVideo ? "🎬 Video" : "Principal"}
        </span>
      )}

      <button
        type="button"
        className="sortable-img-item__remove"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        title={item.isVideo ? "Eliminar video" : "Eliminar foto"}
      >
        ✕
      </button>
    </div>
  );
}

/** Grid de imágenes/videos con drag-and-drop + lightbox */
const SortableImageGrid: React.FC<SortableImageGridProps> = ({
  previews,
  onReorder,
  onRemove,
  videoFlags,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);

  // Construir lista de MediaItems combinando URL e indicador de video
  const mediaItems: MediaItem[] = previews.map((url, i) => ({
    url,
    isVideo: videoFlags ? (videoFlags[i] ?? isVideoUrl(url)) : isVideoUrl(url),
  }));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = previews.indexOf(active.id as string);
    const newIndex = previews.indexOf(over.id as string);

    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(arrayMove(previews, oldIndex, newIndex));
    }
  };

  if (previews.length === 0) return null;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => setActiveId(e.active.id as string)}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={previews} strategy={rectSortingStrategy}>
          <div className="sortable-image-grid">
            {mediaItems.map((item, i) => (
              <SortableMedia
                key={item.url}
                item={item}
                index={i}
                onRemove={onRemove}
                onExpand={setLightbox}
              />
            ))}
          </div>
        </SortableContext>
        {activeId && (
          <p className="sortable-image-grid__hint">
            Suelta para cambiar la posición
          </p>
        )}
        <p className="sortable-image-grid__tip">
          💡 Arrastra para reordenar · Click para ampliar · La 1ª es la
          principal
        </p>
      </DndContext>

      {/* Lightbox */}
      {lightbox && createPortal(
        <div className="sortable-lightbox" onClick={() => setLightbox(null)}>
          {lightbox.isVideo ? (
            <video
              src={lightbox.url}
              className="sortable-lightbox__img"
              controls
              autoPlay
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={lightbox.url}
              alt="Vista ampliada"
              className="sortable-lightbox__img"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <button
            className="sortable-lightbox__close"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
        </div>,
        document.body
      )}
    </>
  );
};

export default SortableImageGrid;
