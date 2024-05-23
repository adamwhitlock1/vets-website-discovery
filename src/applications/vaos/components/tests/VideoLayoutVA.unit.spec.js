import React from 'react';
import { expect } from 'chai';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import VideoLayoutVA from '../layout/VideoLayoutVA';
import { VIDEO_TYPES } from '../../utils/constants';

describe('VAOS Component: VideoLayoutVA', () => {
  const initialState = {
    appointments: {
      facilityData: {
        '983': {
          address: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
          name: 'Cheyenne VA Medical Center',
          telecom: [
            {
              system: 'phone',
              value: '307-778-7550',
            },
          ],
        },
      },
    },
    featureToggles: {
      vaOnlineSchedulingAppointmentDetailsRedesign: true,
      vaOnlineSchedulingPhysicalLocation: true,
    },
  };

  describe('When viewing upcomming appointment details', () => {
    describe('And video type is clinic', () => {
      it('should display VA video layout', async () => {
        // Arrange
        const store = createTestStore(initialState);
        const appointment = {
          comment: 'This is a test:Additional information',
          location: {
            stationId: '983',
            clinicName: 'Clinic 1',
            clinicPhysicalLocation: 'CHEYENNE',
          },
          videoData: {
            isVideo: true,
            facilityId: '983',
            kind: VIDEO_TYPES.clinic,
            extension: {
              patientHasMobileGfe: false,
            },
          },
          vaos: {
            isCommunityCare: false,
            isCompAndPenAppointment: false,
            isCOVIDVaccine: false,
            isPendingAppointment: false,
            isUpcomingAppointment: true,
            isVideo: true,
            apiData: {
              serviceType: 'primaryCare',
            },
          },
          status: 'booked',
        };

        // Act
        const screen = renderWithStoreAndRouter(
          <VideoLayoutVA data={appointment} />,
          {
            store,
          },
        );

        // Assert
        expect(
          screen.getByRole('heading', {
            level: 1,
            name: /Video appointment at VA location/i,
          }),
        );

        expect(
          screen.getByRole('heading', {
            level: 2,
            name: /How to join/i,
          }),
        );

        expect(
          screen.getByRole('heading', {
            level: 2,
            name: /When/i,
          }),
        );
        expect(
          screen.container.querySelector('va-button[text="Add to calendar"]'),
        ).to.be.ok;

        expect(
          screen.getByRole('heading', {
            level: 2,
            name: /What/i,
          }),
        );
        expect(screen.getByText(/Primary care/i));

        expect(
          screen.getByRole('heading', {
            level: 2,
            name: /Who/i,
          }),
        );

        expect(
          screen.getByRole('heading', {
            level: 2,
            name: /Need to make changes/i,
          }),
        );
        expect(screen.getByText(/Cheyenne VA Medical Center/i));
        expect(screen.getByText(/2360 East Pershing Boulevard/i));
        expect(screen.container.querySelector('va-icon[icon="directions"]')).to
          .be.ok;

        expect(screen.getByText(/Clinic: Clinic 1/i));
        expect(screen.getByText(/Clinic phone:/i));
        expect(
          screen.container.querySelector(
            'va-telephone[contact="307-778-7550"]',
          ),
        ).to.be.ok;

        expect(screen.container.querySelector('va-button[text="Print"]')).to.be
          .ok;
        expect(
          screen.container.querySelector(
            'va-button[text="Cancel appointment"]',
          ),
        ).not.to.exist;
      });
    });

    describe('And video type is store forward', () => {
      it('should display VA video layout', async () => {
        // Arrange
        const store = createTestStore(initialState);
        const appointment = {
          comment: 'This is a test:Additional information',
          location: {
            stationId: '983',
            clinicName: 'Clinic 1',
            clinicPhysicalLocation: 'CHEYENNE',
          },
          videoData: {
            isVideo: true,
            facilityId: '983',
            kind: VIDEO_TYPES.storeForward,
            extension: {
              patientHasMobileGfe: false,
            },
          },
          vaos: {
            isCommunityCare: false,
            isCompAndPenAppointment: false,
            isCOVIDVaccine: false,
            isPendingAppointment: false,
            isUpcomingAppointment: true,
            isVideo: true,
            apiData: {
              serviceType: 'primaryCare',
            },
          },
          status: 'booked',
        };

        // Act
        const screen = renderWithStoreAndRouter(
          <VideoLayoutVA data={appointment} />,
          {
            store,
          },
        );

        // Assert
        expect(
          screen.getByRole('heading', {
            level: 1,
            name: /Video appointment at VA location/i,
          }),
        );

        expect(
          screen.getByRole('heading', {
            level: 2,
            name: /How to join/i,
          }),
        );

        expect(
          screen.getByRole('heading', {
            level: 2,
            name: /When/i,
          }),
        );
        expect(
          screen.container.querySelector('va-button[text="Add to calendar"]'),
        ).to.be.ok;

        expect(
          screen.getByRole('heading', {
            level: 2,
            name: /What/i,
          }),
        );
        expect(screen.getByText(/Primary care/i));

        expect(
          screen.getByRole('heading', {
            level: 2,
            name: /Who/i,
          }),
        );

        expect(
          screen.getByRole('heading', {
            level: 2,
            name: /Need to make changes/i,
          }),
        );
        expect(screen.getByText(/Cheyenne VA Medical Center/i));
        expect(screen.getByText(/2360 East Pershing Boulevard/i));
        expect(screen.container.querySelector('va-icon[icon="directions"]')).to
          .be.ok;

        expect(screen.getByText(/Clinic: Clinic 1/i));
        expect(screen.getByText(/Clinic phone:/i));
        expect(
          screen.container.querySelector(
            'va-telephone[contact="307-778-7550"]',
          ),
        ).to.be.ok;

        expect(screen.container.querySelector('va-button[text="Print"]')).to.be
          .ok;
        expect(
          screen.container.querySelector(
            'va-button[text="Cancel appointment"]',
          ),
        ).not.to.exist;
      });
    });
  });

  describe('When viewing past appointment details', () => {
    it('should display VA video layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
        },
        videoData: {
          isVideo: true,
          facilityId: '983',
          kind: VIDEO_TYPES.clinic,
          extension: {
            patientHasMobileGfe: false,
          },
        },
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPastAppointment: true,
          isPendingAppointment: false,
          isUpcomingAppointment: false,
          isVideo: true,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'booked',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <VideoLayoutVA data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Past video appointment at VA location/i,
        }),
      );

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /After visit summary/i,
        }),
      );

      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /How to join/i,
        }),
      ).not.to.exist;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /When/i,
        }),
      );
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).not.to.exist;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /What/i,
        }),
      );
      expect(screen.getByText(/Primary care/i));

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Who/i,
        }),
      );

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Where/i,
        }),
      );
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(screen.getByText(/2360 East Pershing Boulevard/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByText(/Clinic: Clinic 1/i));
      expect(screen.getByText(/Clinic phone:/i));
      expect(
        screen.container.querySelector('va-telephone[contact="307-778-7550"]'),
      ).to.be.ok;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;
    });
  });

  describe('When viewing canceled appointment details', () => {
    it('should display VA video layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
        },
        videoData: {
          isVideo: true,
          facilityId: '983',
          kind: VIDEO_TYPES.clinic,
          extension: {
            patientHasMobileGfe: true,
          },
        },
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPastAppointment: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          isVideo: true,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'cancelled',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <VideoLayoutVA data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Canceled video appointment at VA location/i,
        }),
      );

      expect(
        screen.getByText(
          /If you want to reschedule, call us or schedule a new appointment online/i,
        ),
      );
      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /After visit summary/i,
        }),
      ).not.to.exist;

      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /How to join/i,
        }),
      ).not.to.exist;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /When/i,
        }),
      );
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).not.to.exist;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /What/i,
        }),
      );
      expect(screen.getByText(/Primary care/i));

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Who/i,
        }),
      );

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Where/i,
        }),
      );
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(screen.getByText(/2360 East Pershing Boulevard/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByText(/Clinic: Clinic 1/i));
      expect(screen.getByText(/Location: CHEYENNE/i));
      expect(screen.getByText(/Clinic phone:/i));
      expect(
        screen.container.querySelector('va-telephone[contact="307-778-7550"]'),
      ).to.be.ok;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;
    });
  });
});