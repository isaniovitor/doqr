"use client";

import { useOptimistic, useRef } from "react";

export type OptimisticOp<T extends { id?: string }> =
  | { type: "create"; tempId: string; patch: Partial<T> }
  | { type: "update"; id: string; patch: Partial<T> }
  | { type: "delete"; id: string }
  | { type: "rollback"; snapshot: T[] };

function reducer<
  T extends {
    id?: string;
    isRemoving?: boolean;
    isCreating?: boolean;
    isEditing?: boolean;
  }
>(state: T[], op: OptimisticOp<T>): T[] {
  switch (op.type) {
    case "create":
      return [{ id: op.tempId, ...(op.patch as T) }, ...state];
    case "update":
      return state.map((item) =>
        item.id == op.id ? { ...item, ...op.patch } : item
      );
    case "delete":
      return state.map((item) =>
        item.id == op.id ? { ...item, isRemoving: true } : item
      );
    case "rollback":
      return op.snapshot;
    default:
      return state;
  }
}

const useOptimisticCrud = <
  T extends {
    id?: string;
    isRemoving?: boolean;
    isCreating?: boolean;
    isEditing?: boolean;
  }
>(
  initial: T[]
) => {
  const lastSnapshotRef = useRef<T[]>(initial);
  const [items, dispatch] = useOptimistic<T[], OptimisticOp<T>>(
    initial,
    reducer
  );

  return {
    items,
    create: (patch: Partial<T>) =>
      dispatch({
        type: "create",
        tempId: "new",
        patch: { isCreating: true, ...patch },
      }),
    update: (id: string, patch: Partial<T>) =>
      dispatch({ type: "update", id, patch: { isEditing: true, ...patch } }),
    remove: (id: string) => dispatch({ type: "delete", id }),
    rollback: () =>
      dispatch({ type: "rollback", snapshot: lastSnapshotRef.current }), // <- expõe rollback
    rawDispatch: dispatch,
  };
};

export default useOptimisticCrud;
