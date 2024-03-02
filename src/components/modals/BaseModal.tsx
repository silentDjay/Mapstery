import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface BaseModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  children,
  title,
  isOpen,
}) => {
  const backdrop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.position = "initial";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("overflow");
    };
  }, []);

  if (typeof document === "undefined") return null;

  const portal = createPortal(
    <div role="dialog" className="backdrop" ref={backdrop}>
      {title && <h1 className="modal-title">{title}</h1>}
      <div className="modal-content">{children}</div>
    </div>,
    document.body
  );

  return isOpen ? portal : null;
};
