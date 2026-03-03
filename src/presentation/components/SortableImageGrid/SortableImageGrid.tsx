/**
 * SortableImageGrid — RF19
 *
 * Grid de imágenes con drag-and-drop para reordenar.
 * Usa @dnd-kit/sortable para arrastrar y soltar.
 * La primera imagen se convierte en la foto principal.
 * Click en una imagen abre un lightbox a pantalla completa.
 */

import React, { useState } from "react";
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

interface SortableImageGridProps {
  previews: string[];
  onReorder: (newOrder: string[]) => void;
  onRemove: (index: number) => void;
}

/** Tarjeta individual de imagen sorteable */
function SortableImage({
  url,
  index,
  onRemove,
  onExpand,
}: {
  url: string;
  index: number;
  onRemove: (i: number) => void;
  onExpand: (url: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-img-item ${isDragging ? "sortable-img-item--dragging" : ""}`}
      onClick={() => onExpand(url)}
    >
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
      <img
        src={url}
        alt={`Foto ${index + 1}`}
        className="sortable-img-item__img"
      />
      {index === 0 && (
        <span className="sortable-img-item__badge">Principal</span>
      )}
      <button
        type="button"
        className="sortable-img-item__remove"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        title="Eliminar foto"
      >
        ✕
      </button>
    </div>
  );
}

/** Grid de imágenes con drag-and-drop + lightbox */
const SortableImageGrid: React.FC<SortableImageGridProps> = ({
  previews,
  onReorder,
  onRemove,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

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
            {previews.map((url, i) => (
              <SortableImage
                key={url}
                url={url}
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
      {lightbox && (
        <div className="sortable-lightbox" onClick={() => setLightbox(null)}>
          <img
            src={lightbox}
            alt="Vista ampliada"
            className="sortable-lightbox__img"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="sortable-lightbox__close"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default SortableImageGrid;
