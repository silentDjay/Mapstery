import React from "react";

import { BaseModal, BaseModalProps } from "./BaseModal";

export const WelcomeModal: React.FC<BaseModalProps> = ({ isOpen, onClose }) => (
  <BaseModal isOpen={!!isOpen} title={"MAPSTERY"}>
    <button
      style={{ fontSize: "125%" }}
      onClick={onClose}
      className="pure-button pure-button-primary"
    >
      Countries of the World
    </button>
  </BaseModal>
);
