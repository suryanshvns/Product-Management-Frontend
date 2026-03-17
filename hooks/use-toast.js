"use client";

import * as React from "react";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 5000;

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const ToastContext = React.createContext({
  toasts: [],
  addToast: () => {},
  dismiss: () => {},
  remove: () => {},
});

function toastReducer(state, action) {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case "UPDATE_TOAST":
      return {
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        return {
          toasts: state.toasts.map((t) =>
            t.id === toastId ? { ...t, open: false } : t
          ),
        };
      }
      return { toasts: state.toasts.map((t) => ({ ...t, open: false })) };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) return { toasts: [] };
      return {
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
}

export function ToastProviderWrapper({ children }) {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] });

  const addToast = React.useCallback((options = {}) => {
    const id = genId();
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
    const remove = () =>
      setTimeout(
        () => dispatch({ type: "REMOVE_TOAST", toastId: id }),
        TOAST_REMOVE_DELAY
      );
    const toastOption = {
      ...options,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          dismiss();
          remove();
        }
      },
    };
    dispatch({ type: "ADD_TOAST", toast: toastOption });
    return {
      id,
      dismiss,
      update: (props) =>
        dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } }),
    };
  }, []);

  const value = React.useMemo(
    () => ({
      toasts: state.toasts,
      addToast,
      dismiss: (id) => dispatch({ type: "DISMISS_TOAST", toastId: id }),
      remove: (id) => dispatch({ type: "REMOVE_TOAST", toastId: id }),
    }),
    [state.toasts, addToast]
  );

  return (
    <ToastContext.Provider value={value}>
      <ToastProvider>
        {children}
        {state.toasts.map(({ id, title, description, action, variant, ...props }) => (
          <Toast key={id} variant={variant} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    return {
      toast: (opts) => {
        console.warn("Toaster not mounted. Add ToastProviderWrapper to your app.");
        return { id: "", dismiss: () => {}, update: () => {} };
      },
    };
  }
  return {
    toast: ctx.addToast,
    toasts: ctx.toasts,
    dismiss: ctx.dismiss,
  };
}

