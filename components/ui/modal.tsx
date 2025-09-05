// AddressModal.tsx
import {
  Modal as ModalDialog, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton
} from "@chakra-ui/react";
import DaumPostcode, { type Address } from "react-daum-postcode";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCompletePost: (data: Address) => void;
  size?: string; // 선택: 모달 크기 커스터마이즈
};

export function Modal({
  isOpen,
  onClose,
  onCompletePost,
  size = "sm",
}: Props) {
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay
        zIndex="popover"
      />
      <ModalContent width="500px">
        <ModalHeader>주소검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          <DaumPostcode onComplete={onCompletePost} />
        </ModalBody>
      </ModalContent>
    </ModalDialog>
  );
}
