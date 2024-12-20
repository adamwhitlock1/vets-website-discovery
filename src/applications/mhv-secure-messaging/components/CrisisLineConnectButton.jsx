import React, { useEffect, useState } from 'react';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { openCrisisModal } from '@department-of-veterans-affairs/mhv/exports';

const CrisisLineConnectButton = () => {
  const [lastFocusableElement, setLastFocusableElement] = useState(null);
  const [crisisModalOpened, setCrisisModalOpened] = useState(false);

  useEffect(
    () => {
      const onCrisisModalClose = () => {
        setCrisisModalOpened(false);
        focusElement(lastFocusableElement);
      };

      const onEscapeKeyPress = e => {
        if (e.keyCode === 27) {
          onCrisisModalClose();
        }
      };
      const modalCloseButton = document.getElementsByClassName(
        'va-modal-close',
      )[0];

      if (crisisModalOpened) {
        modalCloseButton.addEventListener('click', onCrisisModalClose);
        window.addEventListener('keydown', onEscapeKeyPress);
      }
      return () => {
        modalCloseButton.removeEventListener('click', onCrisisModalClose);
        window.removeEventListener('keydown', onEscapeKeyPress);
      };
    },
    [lastFocusableElement, crisisModalOpened],
  );

  return (
    <va-button
      class="vads-u-margin-y--1p5"
      secondary="true"
      text="Connect with the Veterans Crisis Line"
      data-dd-action-name="Connect with the Veterans Crisis Line Button"
      onClick={e => {
        setLastFocusableElement(e.target.shadowRoot.firstChild);
        setCrisisModalOpened(true);
        openCrisisModal();
      }}
    />
  );
};

export default CrisisLineConnectButton;
