// components/ui/confirm.tsx
"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  ButtonProps,
} from "@chakra-ui/react";

type ConfirmProps = {
  isOpen: boolean;                       // 부모에서 열림 상태 제어
  onOpenChange: (open: boolean) => void; // true/false로 열고 닫기
  onConfirm: () => void;

  title?: string;
  message?: string;

  cancelLabel?: string;
  confirmLabel?: string;
  cancelButtonProps?: ButtonProps;
  confirmButtonProps?: ButtonProps;
};

export function Confirm({
  isOpen,
  onOpenChange,
  onConfirm,
  title = "삭제 확인",
  message = "정말 삭제하시겠습니까?",
  cancelLabel = "취소",
  confirmLabel = "삭제",
  cancelButtonProps,
  confirmButtonProps,
}: ConfirmProps) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => onOpenChange(false)}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>{message}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => onOpenChange(false)} {...cancelButtonProps}>
              {cancelLabel}
            </Button>
            <Button
              ml={3}
              colorScheme="red"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              {...confirmButtonProps}
            >
              {confirmLabel}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
