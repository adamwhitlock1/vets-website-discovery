import React, { useEffect, useMemo } from 'react';
import PropType from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import CrisisLineConnectButton from '../components/CrisisLineConnectButton';

const InterstitialPage = props => {
  const { acknowledge, type } = props;

  useEffect(() => {
    focusElement(document.querySelector('h1'));
  }, []);

  const continueButtonText = useMemo(
    () => {
      switch (type) {
        case 'reply':
          return 'Continue to reply';
        case 'draft':
          return 'Continue to draft';
        default:
          return 'Continue to start message';
      }
    },
    [type],
  );

  return (
    <div className="interstitial-page">
      <h1>
        Only use messages for <span className="no-word-wrap">non-urgent</span>{' '}
        needs
      </h1>
      <div>
        <p>
          Your care team may take up to <strong>3 business days</strong> to
          reply.
        </p>

        <va-button
          uswds
          data-testid="continue-button"
          onClick={acknowledge}
          text={continueButtonText}
          data-dd-action-name={continueButtonText}
        />

        <h2 className="vads-u-font-size--h3">
          If you need help sooner, use one of these urgent communication
          options:
        </h2>
        <ul>
          <li>
            <p>
              <strong>
                If you’re in crisis or having thoughts of suicide,{' '}
              </strong>{' '}
              connect with our Veterans Crisis Line. We offer confidential
              support anytime, day or night.
            </p>

            <CrisisLineConnectButton />
          </li>
          <li>
            <p>
              <strong>If you think your life or health is in danger, </strong>{' '}
              call <va-telephone contact="911" /> or go to the nearest emergency
              room.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

InterstitialPage.propTypes = {
  acknowledge: PropType.func,
  type: PropType.string,
};

export default InterstitialPage;