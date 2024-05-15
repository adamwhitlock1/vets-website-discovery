import React from 'react';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import SignedInLayout from './SignedInLayout';

const SignedInLayoutWrapper = () => {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const isPilotToggleLoading = useToggleLoadingValue();
  const isInPilot = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalPilot,
  );

  // TODO: Update with permissions check
  const hasPOAPermissions = true;

  return (
    <SignedInLayout
      isPilotToggleLoading={isPilotToggleLoading}
      isInPilot={isInPilot}
      hasPOAPermissions={hasPOAPermissions}
    />
  );
};

export default SignedInLayoutWrapper;