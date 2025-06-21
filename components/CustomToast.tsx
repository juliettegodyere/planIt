import { Button, ButtonText } from "@/components/ui/button";
import { useToast, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";
import React, { useEffect } from "react";
	
export default function CustomToast() {
          const toast = useToast();
          const [toastId, setToastId] = React.useState(0);

          useEffect(() => {
            const showNewToast = () => {
                const newId = Math.random();
                setToastId(newId);
                toast.show({
                  id: String(newId),
                  placement: 'top',
                  duration: 3000,
                  render: ({ id }) => {
                    const uniqueToastId = "toast-" + id;
                    return (
                      <Toast nativeID={uniqueToastId} action="muted" variant="solid" >
                        <ToastTitle>Hello!</ToastTitle>
                        <ToastDescription>
                          This is a customized toast message.
                        </ToastDescription>
                      </Toast>
                    );
                  },
                });
              };
              showNewToast();
          }, []);
          return (
           <></>
          );
        }