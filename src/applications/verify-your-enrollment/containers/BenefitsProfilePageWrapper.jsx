import React from 'react';
import PropTypes from 'prop-types';
import EnrollmentVerificationBreadcrumbs from '../components/EnrollmentVerificationBreadcrumbs';
import ChangeOfAddressWrapper from './ChangeOfAddressWrapper';
import ChangeOfDirectDepositWrapper from './ChangeOfDirectDepositWrapper';
import BenefitsProfileStatement from '../components/BenefitsProfileStatement';
import RemainingBenefits from '../components/RemainingBenefits';
import BenefitsExpirationDate from '../components/BenefitsExpirationDate';
import PayeeInformationWrapper from './PayeeInformationWrapper';
import PageLink from '../components/PageLink';
import {
  VERIFICATION_RELATIVE_URL,
  VERIFICATION_PROFILE_URL,
} from '../constants';

const BenefitsProfileWrapper = ({ children }) => {
  return (
    <>
      <div name="topScrollElement" />
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12">
            <EnrollmentVerificationBreadcrumbs />
          </div>
        </div>
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            <BenefitsProfileStatement />
            <PayeeInformationWrapper />
            <ChangeOfAddressWrapper
              mailingAddress={{
                street: '9027 Walnut Springs Road',
                city: 'Universal City',
                state: 'TX',
                zip: '78148-2240',
              }}
            />
            <ChangeOfDirectDepositWrapper />
            <RemainingBenefits />
            <BenefitsExpirationDate />
            <PageLink
              linkText="See your enrollment verifications"
              relativeURL={VERIFICATION_RELATIVE_URL}
              URL={VERIFICATION_PROFILE_URL}
            />
            {children}
          </div>
        </div>
        <va-back-to-top />
      </div>
    </>
  );
};

BenefitsProfileWrapper.propTypes = {
  children: PropTypes.any,
};

export default BenefitsProfileWrapper;