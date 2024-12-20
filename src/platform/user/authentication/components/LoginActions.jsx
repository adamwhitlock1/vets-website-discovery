import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { externalApplicationsConfig } from '../usip-config';
import {
  EXTERNAL_APPS,
  OCC_MOBILE,
  OCC_MOBILE_DSLOGON_ONLY,
} from '../constants';
import { reduceAllowedProviders, getQueryParams } from '../utilities';
import LoginButton from './LoginButton';
import LoginNote from './LoginNote';

export default function LoginActions({ externalApplication, isUnifiedSignIn }) {
  const [useOAuth, setOAuth] = useState();
  const { OAuth, redirectUri } = getQueryParams();
  const { OAuthEnabled } =
    externalApplicationsConfig[externalApplication] ??
    externalApplicationsConfig.default;

  useEffect(
    () => {
      setOAuth(OAuthEnabled && OAuth === 'true');
    },
    [OAuth, OAuthEnabled],
  );
  const isRedirectUriPresent =
    externalApplication?.includes(EXTERNAL_APPS.VA_OCC_MOBILE) &&
    redirectUri &&
    OCC_MOBILE_DSLOGON_ONLY.includes(redirectUri);
  const isRegisteredApp =
    externalApplication?.includes(EXTERNAL_APPS.VA_OCC_MOBILE) &&
    isRedirectUriPresent
      ? OCC_MOBILE.REGISTERED_APPS
      : OCC_MOBILE.DEFAULT;

  const v2SignInProviders = { logingov: true, idme: true };
  const isValid = isRegisteredApp !== OCC_MOBILE.REGISTERED_APPS;
  const actionLocation = isUnifiedSignIn ? 'usip' : 'modal';

  return (
    <div className="row">
      <div className="columns print-full-width sign-in-wrapper">
        {reduceAllowedProviders(v2SignInProviders, isRegisteredApp).map(csp => (
          <LoginButton
            csp={csp}
            key={csp}
            useOAuth={useOAuth}
            actionLocation={actionLocation}
          />
        ))}
        <LoginNote />
        {isValid && (
          <div>
            <h2>Other sign-in options</h2>
            <h3 id="mhvH3">
              My HealtheVet sign-in option
              <span className="vads-u-display--block vads-u-font-size--md vads-u-font-family--sans">
                Available through January 31, 2025
              </span>
            </h3>
            <p>
              You’ll still be able to use the <strong>My HealtheVet</strong>{' '}
              website after this date. You’ll just need to start signing in with
              a <strong>Login.gov</strong> or <strong>ID.me</strong> account.
            </p>
            <LoginButton
              csp="mhv"
              useOAuth={useOAuth}
              ariaDescribedBy="mhvH3"
              actionLocation={actionLocation}
            />
            <h3
              id="dslogonH3"
              className="vads-u-margin-bottom--0 vads-u-margin-top--3"
            >
              DS Logon sign-in option
              <span className="vads-u-display--block vads-u-font-size--md vads-u-font-family--sans">
                Available through September 30, 2025
              </span>
            </h3>
            <p>
              You’ll still be able to use your <strong>DS Logon</strong> account
              on Defense Department websites after this date.
            </p>
            <LoginButton
              csp="dslogon"
              useOAuth={useOAuth}
              ariaDescribedBy="dslogonH3"
              actionLocation={actionLocation}
            />
          </div>
        )}
      </div>
    </div>
  );
}

LoginActions.propTypes = {
  externalApplication: PropTypes.object,
  isUnifiedSignIn: PropTypes.bool,
};
