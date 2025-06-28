// toastUtils.ts

import {
    Toast,
    ToastDescription,
    ToastTitle,
    useToast,
  } from "@/components/ui/toast";
  
  export const showToast = (
    toast: ReturnType<typeof useToast>,
    options: {
      title: string;
      description: string;
      action?: "error" | "success" | "warning" | "info" | "muted";
      duration?: number;
      placement?: "top" | "bottom"; // ✅ fix type here
    }
  ) => {
    const {
      title,
      description,
      action = "error",
      duration = 5000,
      placement = "top",
    } = options;
  
    toast.show({
      id: `toast-${Date.now()}`,
      placement,
      duration,
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action={action} variant="solid">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
        </Toast>
      ),
    });
  };
  