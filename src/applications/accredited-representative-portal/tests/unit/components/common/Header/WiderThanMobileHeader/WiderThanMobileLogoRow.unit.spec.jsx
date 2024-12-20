import React from 'react';
import { expect } from 'chai';

import WiderThanMobileLogoRow from '../../../../../../components/common/Header/WiderThanMobileHeader/WiderThanMobileLogoRow';
import { renderTestApp } from '../../../../helpers';

describe('WiderThanMobileLogoRow', () => {
  it('renders the logo with correct attributes', () => {
    const { getByTestId } = renderTestApp(<WiderThanMobileLogoRow />);
    const logoImg = getByTestId('wider-than-mobile-logo-row-logo');
    expect(logoImg.src).to.include('/img/arp-header-logo.png');
    expect(logoImg.alt).to.eq(
      'VA Accredited Representative Portal Logo, U.S. Department of Veterans Affairs',
    );
  });

  it('renders UserNav and displays sign-in link when no profile exists', () => {
    const { getByTestId } = renderTestApp(<WiderThanMobileLogoRow />);
    const signInLink = getByTestId('user-nav-wider-than-mobile-sign-in-link');
    expect(signInLink.textContent).to.eq('Sign in');
  });
});
