import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import MockDate from 'mockdate';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';

import reducer from '../../redux/reducer';
import App from '../../containers/TravelPayStatusApp';
import { formatDateTime } from '../../util/dates';
import travelClaims from '../../services/mocks/travel-claims-31.json';

describe('App', () => {
  let oldLocation;
  const getData = ({
    areFeatureTogglesLoading = true,
    hasFeatureFlag = true,
    hasClaimDetailsFeatureFlag = true,
    isLoggedIn = true,
  } = {}) => {
    return {
      featureToggles: {
        loading: areFeatureTogglesLoading,
        /* eslint-disable camelcase */
        travel_pay_power_switch: hasFeatureFlag,
        travel_pay_view_claim_details: hasClaimDetailsFeatureFlag,
        /* eslint-enable camelcase */
      },
      user: {
        login: {
          currentlyLoggedIn: isLoggedIn,
        },
        profile: {
          services: [backendServices.USER_PROFILE],
        },
      },
    };
  };

  const aprDate = '2024-04-22T16:45:34.465Z';
  const febDate = '2024-02-22T16:45:34.465Z';
  const previousYearDate = '2023-09-21T17:11:43.034Z';

  beforeEach(() => {
    oldLocation = global.window.location;
    delete global.window.location;
    global.window.location = {
      replace: sinon.spy(),
    };
    const mockTravelClaims = {
      data: [
        {
          id: '6ea23179-e87c-44ae-a20a-f31fb2c132fb',
          claimNumber: 'TC0928098230498',
          claimName: 'string',
          claimStatus: 'In Process',
          appointmentDateTime: aprDate,
          appointmentName: 'more recent',
          appointmentLocation: 'Cheyenne VA Medical Center',
          createdOn: '2024-04-22T21:22:34.465Z',
          modifiedOn: '2024-04-23T16:44:34.465Z',
        },
        {
          id: '6ea23179-e87c-44ae-a20a-f31fb2c132ig',
          claimNumber: 'TC0928098230498',
          claimName: 'string',
          claimStatus: 'Incomplete',
          appointmentDateTime: febDate,
          appointmentName: 'older',
          appointmentLocation: 'Cheyenne VA Medical Center',
          createdOn: '2024-02-22T21:22:34.465Z',
          modifiedOn: '2024-02-23T16:44:34.465Z',
        },
        {
          id: 'abcd1234-65af-4495-b18e-7fd28cab546a',
          claimNumber: 'TC0928098231234',
          claimName: 'string',
          claimStatus: 'Saved',
          appointmentDateTime: null,
          appointmentName: 'Medical imaging',
          appointmentLocation: 'Tomah VA Medical Center',
          createdOn: '2024-01-22T17:11:43.034Z',
          modifiedOn: '2024-01-22T17:11:43.034Z',
        },
        {
          id: '6cecf332-65af-4495-b18e-7fd28ccb546a',
          claimNumber: '39b7b38f-b7cf-4d19-91cf-fb5360c0b8b8',
          claimName: '3583ec0e-34e0-4cf5-99d6-78930c2be969',
          claimStatus: 'Saved',
          appointmentDateTime: previousYearDate,
          appointmentName: 'Medical imaging',
          appointmentLocation: 'Tomah VA Medical Center',
          createdOn: '2023-09-22T17:11:43.034Z',
          modifiedOn: '2023-09-27T17:11:43.034Z',
        },
      ],
    };
    mockApiRequest(mockTravelClaims);
    MockDate.set('2024-06-25');
  });

  afterEach(() => {
    global.window.location = oldLocation;
    MockDate.reset();
  });

  it('should redirect if feature flag is off', async () => {
    renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: false,
      }),
      path: `/`,
      reducers: reducer,
    });
    await waitFor(() => {
      expect(window.location.replace.called).to.be.true;
    });
  });

  it('should render loading state if feature flag is loading', async () => {
    const screenFeatureToggle = renderWithStoreAndRouter(<App />, {
      initialState: getData(),
      path: `/`,
      reducers: reducer,
    });
    expect(
      await screenFeatureToggle.getByTestId('travel-pay-loading-indicator'),
    ).to.exist;
  });

  it('renders a login prompt for an unauthenticated user', async () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: false,
      }),
      path: `/`,
      reducers: reducer,
    });
    expect(await screen.findByText('Log in to view your travel claims')).to
      .exist;
  });

  it('shows the login modal when clicking the login prompt', async () => {
    const { container } = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    expect($('va-loading-indicator', container)).to.exist;
  });

  it('handles a failed fetch of claims', async () => {
    global.fetch.restore();
    mockApiRequest({ errors: [{ title: 'Bad Request', status: 400 }] }, false);

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(async () => {
      expect(await screen.findByText('Error fetching travel claims.')).to.exist;
    });
  });

  it('handles a successful fetch of zero claims', async () => {
    global.fetch.restore();
    mockApiRequest({ data: [] });

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(async () => {
      expect(screen.queryAllByTestId('travel-claim-details').length).to.eq(0);
      expect(await screen.findByText('No travel claims to show.')).to.exist;
    });
  });

  it('successfully fetches and displays claims', async () => {
    global.fetch.restore();
    mockApiRequest({
      data: [
        {
          id: '6ea23179-e87c-44ae-a20a-f31fb2c132fb',
          claimNumber: 'TC0928098230498',
          claimName: 'string',
          claimStatus: 'In Process',
          appointmentDateTime: aprDate,
          appointmentName: 'more recent',
          appointmentLocation: 'Cheyenne VA Medical Center',
          createdOn: '2024-04-22T21:22:34.465Z',
          modifiedOn: '2024-04-23T16:44:34.465Z',
        },
      ],
    });

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(async () => {
      expect(screen.queryAllByTestId('travel-claim-details').length).to.eq(1);
      expect(await screen.findByText('Travel reimbursement claim details')).to
        .exist;
    });
  });

  it("doesn't show claim details link if feature flag is disabled", async () => {
    global.fetch.restore();
    mockApiRequest({
      data: [
        {
          id: '6ea23179-e87c-44ae-a20a-f31fb2c132fb',
          claimNumber: 'TC0928098230498',
          claimName: 'string',
          claimStatus: 'In Process',
          appointmentDateTime: aprDate,
          appointmentName: 'more recent',
          appointmentLocation: 'Cheyenne VA Medical Center',
          createdOn: '2024-04-22T21:22:34.465Z',
          modifiedOn: '2024-04-23T16:44:34.465Z',
        },
      ],
    });

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        hasClaimDetailsFeatureFlag: false,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(async () => {
      expect(screen.queryAllByTestId('travel-claim-details').length).to.eq(1);
      expect(screen.queryByText('Travel reimbursement claim details')).to.be
        .null;
    });
  });

  it('shows the login modal when clicking the login prompt', async () => {
    const { container } = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: false,
      }),
      path: `/`,
      reducers: reducer,
    });

    fireEvent.click($('va-button', container));
    // TODO: make this check for the modal itself
    expect($('va-button', container)).to.exist;
  });

  it('sorts the claims correctly using the select-option', async () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(() => {
      const [date, time] = formatDateTime(previousYearDate);
      userEvent.selectOptions(
        screen.getByLabelText(
          'Show appointments with travel claims in this order',
        ),
        ['oldest'],
      );
      expect(screen.getByRole('option', { name: 'Oldest' }).selected).to.be
        .true;
      fireEvent.click(document.querySelector('va-button[text="Sort"]'));

      expect(screen.getAllByTestId('travel-claim-details').length).to.eq(4);
      expect(
        screen.getAllByTestId('travel-claim-details')[0].textContent,
      ).to.eq(`${date} at ${time} appointment`);
      expect(
        screen.getAllByTestId('travel-claim-details')[1].textContent,
      ).to.eq('Appointment information not available');
    });

    await waitFor(() => {
      const [date, time] = formatDateTime(aprDate);
      userEvent.selectOptions(
        screen.getByLabelText(
          'Show appointments with travel claims in this order',
        ),
        ['mostRecent'],
      );
      expect(screen.getByRole('option', { name: 'Most Recent' }).selected).to.be
        .true;
      fireEvent.click(document.querySelector('va-button[text="Sort"]'));

      expect(screen.getAllByTestId('travel-claim-details').length).to.eq(4);
      expect(
        screen.getAllByTestId('travel-claim-details')[0].textContent,
      ).to.eq(`${date} at ${time} appointment`);
      expect(
        screen.getAllByTestId('travel-claim-details')[2].textContent,
      ).to.eq('Appointment information not available');
    });
  });

  it('filters by status', async () => {
    global.fetch.restore();
    mockApiRequest(travelClaims);

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(async () => {
      userEvent.click(
        document.querySelector(
          'va-accordion-item[header="Filter travel claims"]',
        ),
      );

      const statusFilters = screen.getAllByTestId(/status-filter_/);
      const filterNames = statusFilters.map(filter => filter.name);

      const orderedStatuses = [
        'On Hold',
        'Denied',
        'In Manual Review',
        'Appealed',
        'Claim Submitted',
        'Closed',
        'In Process',
        'Incomplete',
        'Saved',
      ];
      expect(filterNames).to.eql(orderedStatuses);

      const checkboxGroup = $('#status-checkboxes');
      checkboxGroup.__events.vaChange({
        target: {
          name: 'Incomplete',
          checked: true,
        },
      });
    });

    userEvent.click($('va-button[text="Apply filters"]'));

    expect(screen.getAllByTestId('travel-claim-details').length).to.eq(1);
  });

  it('Orders status filters correctly when claims only have a subset of "top" statuses', async () => {
    global.fetch.restore();
    const topStatusesSubset = travelClaims.data.filter(
      claim =>
        claim.claimStatus === 'On Hold' ||
        claim.claimStatus === 'In Manual Review',
    );
    mockApiRequest({ data: topStatusesSubset });

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(async () => {
      userEvent.click(
        document.querySelector(
          'va-accordion-item[header="Filter travel claims"]',
        ),
      );

      const statusFilters = screen.getAllByTestId(/status-filter_/);
      const filterNames = statusFilters.map(filter => filter.name);

      const orderedStatuses = ['On Hold', 'In Manual Review'];
      expect(filterNames).to.eql(orderedStatuses);
    });
  });
  it('Orders status filters correctly when claims have no "top" statuses', async () => {
    global.fetch.restore();
    const nonTopStatuses = travelClaims.data.filter(
      claim =>
        !['On Hold', 'Denied', 'In Manual Review'].includes(claim.claimStatus),
    );
    mockApiRequest({ data: nonTopStatuses });

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(async () => {
      userEvent.click(
        document.querySelector(
          'va-accordion-item[header="Filter travel claims"]',
        ),
      );

      const statusFilters = screen.getAllByTestId(/status-filter_/);
      const filterNames = statusFilters.map(filter => filter.name);

      const orderedStatuses = [
        'Appealed',
        'Claim Submitted',
        'Closed',
        'In Process',
        'Incomplete',
        'Saved',
      ];
      expect(filterNames).to.eql(orderedStatuses);
    });
  });
  it('Orders status filters correctly when claims have a subset of top statuses and non-top statuses', async () => {
    global.fetch.restore();
    const topStatusesSubset = travelClaims.data.filter(
      claim =>
        claim.claimStatus === 'On Hold' ||
        claim.claimStatus === 'In Manual Review' ||
        claim.claimStatus === 'Closed' ||
        claim.claimStatus === 'Saved',
    );
    mockApiRequest({ data: topStatusesSubset });

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(async () => {
      userEvent.click(
        document.querySelector(
          'va-accordion-item[header="Filter travel claims"]',
        ),
      );

      const statusFilters = screen.getAllByTestId(/status-filter_/);
      const filterNames = statusFilters.map(filter => filter.name);

      const orderedStatuses = [
        'On Hold',
        'In Manual Review',
        'Closed',
        'Saved',
      ];
      expect(filterNames).to.eql(orderedStatuses);
    });
  });

  it('filters by date range', async () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(() => {
      const [date, time] = formatDateTime(previousYearDate);

      userEvent.click(
        document.querySelector(
          'va-accordion-item[header="Filter travel claims"]',
        ),
      );

      const dateSelect = screen.getByTestId('claimsDates');
      dateSelect.__events.vaSelect({
        target: {
          value: 'All of 2023',
        },
      });

      userEvent.selectOptions(dateSelect, ['All of 2023']);

      expect(screen.getByRole('option', { name: 'All of 2023' }).selected).to
        .true;

      userEvent.click(
        document.querySelector('va-button[text="Apply filters"]'),
      );

      expect(
        screen.findByText(
          'Showing 1 ‒ 10 of 31 claims, sorted by date (most recent), with 1 filter applied.',
        ),
      ).to.exist;
      expect(screen.getAllByTestId('travel-claim-details').length).to.eq(1);
      expect(
        screen.getAllByTestId('travel-claim-details')[0].textContent,
      ).to.eq(`${date} at ${time} appointment`);
    });

    fireEvent.click(document.querySelector('va-button[text="Reset search"]'));
    expect(screen.getAllByTestId('travel-claim-details').length).to.eq(4);
  });

  it('filters by status and date together', async () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(async () => {
      const [date, time] = formatDateTime(previousYearDate);

      userEvent.click(
        document.querySelector(
          'va-accordion-item[header="Filter travel claims"]',
        ),
      );

      const dateSelect = screen.getByTestId('claimsDates');
      dateSelect.__events.vaSelect({
        target: {
          value: 'All of 2023',
        },
      });

      userEvent.selectOptions(dateSelect, ['All of 2023']);

      expect(screen.getByRole('option', { name: 'All of 2023' }).selected).to
        .true;

      const checkboxGroup = $('#status-checkboxes');
      checkboxGroup.__events.vaChange({
        target: {
          name: 'Saved',
          checked: true,
        },
      });

      userEvent.click(
        document.querySelector('va-button[text="Apply filters"]'),
      );

      expect(
        await screen.findByText(
          'Showing 1 ‒ 1 of 1 claims, sorted by date (most recent), with 2 filters applied.',
        ),
      ).to.exist;
      expect(screen.getAllByTestId('travel-claim-details').length).to.eq(1);
      expect(
        screen.getAllByTestId('travel-claim-details')[0].textContent,
      ).to.eq(`${date} at ${time} appointment`);
    });

    fireEvent.click(document.querySelector('va-button[text="Reset search"]'));
    expect(screen.getAllByTestId('travel-claim-details').length).to.eq(4);
  });

  it('renders pagination correctly', async () => {
    global.fetch.restore();
    mockApiRequest(travelClaims);

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(async () => {
      expect(
        await screen.findByText(
          'Showing 1 ‒ 10 of 31 claims, sorted by date (most recent).',
        ),
      ).to.exist;
      // RTL doesn't support shadow DOM elements, so best we can do here is
      // check that the top-level pagination element gets rendered
      expect(await screen.container.querySelectorAll('va-card').length).to.eq(
        10,
      );
      expect(await screen.container.querySelector('va-pagination')).to.exist;
    });
  });
});
