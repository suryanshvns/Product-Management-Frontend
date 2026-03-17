"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { setConfirmHandler } from "@/lib/confirm";

const DEFAULT_TITLE = "Confirm action";
const DEFAULT_MESSAGE = "Are you sure you want to proceed? This action may not be reversible.";

export function ConfirmDialog({ open, onOpenChange, title, message, onConfirm, onCancel }) {
  const handleConfirm = () => {
    onConfirm?.(true);
    onOpenChange(false);
  };
  const handleCancel = () => {
    onConfirm?.(false);
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleCancel()}>
      <DialogContent showClose={true} onPointerDownOutside={handleCancel} onEscapeKeyDown={handleCancel}>
        <DialogHeader>
          <DialogTitle>{title ?? DEFAULT_TITLE}</DialogTitle>
          <DialogDescription>{message ?? DEFAULT_MESSAGE}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ open: false, title: null, message: null, resolve: null });

  const handleConfirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setState({
        open: true,
        title: options.title ?? DEFAULT_TITLE,
        message: options.message ?? DEFAULT_MESSAGE,
        resolve,
      });
    });
  }, []);

  useEffect(() => {
    setConfirmHandler(handleConfirm);
    return () => setConfirmHandler(null);
  }, [handleConfirm]);

  const handleClose = useCallback((confirmed) => {
    setState((prev) => {
      const resolve = prev.resolve;
      if (resolve) resolve(!!confirmed);
      return { open: false, title: null, message: null, resolve: null };
    });
  }, []);

  return (
    <>
      {children}
      <ConfirmDialog
        open={state.open}
        onOpenChange={(open) => !open && handleClose(false)}
        title={state.title}
        message={state.message}
        onConfirm={handleClose}
      />
    </>
  );
}
