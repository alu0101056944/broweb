// src/components/DraggableMusicList.tsx

import React, { useState, useEffect, useCallback } from 'react';
import type { CollectionConfig } from 'payload';

import { useConfig, useAuth } from '@payloadcms/ui';
import { Gutter } from '@payloadcms/ui';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type MusicDoc = {
  id: string;
  description?: string;
  videoUrl: string;
  order: number;
};

const SortableMusicItem: React.FC<{ id: string; item: MusicDoc }> = ({ id, item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 mb-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md
        shadow-sm cursor-grab active:cursor-grabbing transition-shadow"
    >
      <div className="flex flex-col gap-1">
        <strong className="text-base text-gray-900 dark:text-white">
          {item.description || 'No Description'}
        </strong>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{item.videoUrl}</p>
      </div>
    </div>
  );
};

const DraggableMusicList: React.FC<{ collection: CollectionConfig }> = ({ collection }) => {
  const { config  } = useConfig();
  const { user } = useAuth();
  const [items, setItems] = useState<MusicDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized fetch function
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${config.serverURL}${config.routes.api}/${collection.slug}?sort=order&limit=500`, // Fetch up to 500 items, sorted
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${user?.token}`, // Use JWT for auth
          },
        },
      );
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setItems(data.docs);
    } catch (error) {
      console.error('Error fetching music collection:', error);
    } finally {
      setIsLoading(false);
    }
  }, [config.serverURL, config.routes.api, collection.slug, user]);

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Dnd-Kit sensor setup
  const sensors = useSensors(useSensor(PointerSensor));

  // Handler for when a drag operation ends
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reorderedItems = arrayMove(items, oldIndex, newIndex);

        // 1. Optimistically update the UI for a smooth user experience
        setItems(reorderedItems);

        // 2. Prepare API requests to update the 'order' field for all documents
        const updatePromises = reorderedItems.map((item, index) => {
          const newOrder = index + 1; // 1-based ordering
          return fetch(`${config.serverURL}${config.routes.api}/${collection.slug}/${item.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${user?.token}`,
            },
            body: JSON.stringify({ order: newOrder }),
          });
        });

        // 3. Execute all updates and handle the outcome
        try {
          await Promise.all(updatePromises);
          // Optional: You could refetch here to ensure data consistency, but it's often not needed.
          // await fetchItems();
        } catch (error) {
          console.error('Failed to update order:', error);
          // If updates fail, revert the UI to the original state to avoid confusion
          fetchItems(); // Refetch to get the correct server state
        }
      }
    },
    [items, config.serverURL, config.routes.api, collection.slug, user, fetchItems],
  );

  if (isLoading) {
    return (
      <Gutter>
        <div>Loading music...</div>
      </Gutter>
    );
  }

  return (
    <Gutter>
      <h1 className="text-2xl font-bold mb-4">Order Music Videos</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Drag and drop the items below to change their display order. Changes are saved automatically.
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div>
            {items.map((item) => (
              <SortableMusicItem key={item.id} id={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Gutter>
  );
};
export default DraggableMusicList