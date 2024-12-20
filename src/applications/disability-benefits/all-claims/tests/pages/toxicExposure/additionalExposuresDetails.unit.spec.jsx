import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { makePages } from '../../../pages/toxicExposure/additionalExposuresDetails';
import { ADDITIONAL_EXPOSURES } from '../../../constants';
import {
  additionalExposuresPageTitle,
  dateRangeDescriptionWithHazard,
  exposureEndDateApproximate,
  exposureStartDateApproximate,
  notSureHazardDetails,
} from '../../../content/toxicExposure';
import { pageSubmitTest } from '../../unit.helpers.spec';

/**
 * Unit tests for the additional exposures details pages. Verifies each page can render and submit with
 * and without dates. Additionally, verifies the subtitles are built appropriately whether or not
 * the exposure was selected.
 */
describe('additional exposures details', () => {
  const schemas = { ...makePages() };
  const formData = {
    toxicExposure: {
      otherExposures: {
        asbestos: true,
        mos: true,
      },
    },
  };

  Object.keys(ADDITIONAL_EXPOSURES)
    .filter(itemId => itemId !== 'none' && itemId !== 'notsure')
    .forEach(itemId => {
      const pageSchema = schemas[`additional-exposure-${itemId}`];
      it(`should render for ${itemId}`, () => {
        const { container, getByText } = render(
          <DefinitionTester
            schema={pageSchema.schema}
            uiSchema={pageSchema.uiSchema}
            data={formData}
          />,
        );

        getByText(additionalExposuresPageTitle);
        getByText(dateRangeDescriptionWithHazard);

        expect(
          $(
            `va-memorable-date[label="${exposureStartDateApproximate}"]`,
            container,
          ),
        ).to.exist;
        expect(
          $(
            `va-memorable-date[label="${exposureEndDateApproximate}"]`,
            container,
          ),
        ).to.exist;

        expect($(`va-checkbox[label="${notSureHazardDetails}"]`, container)).to
          .exist;

        const addlInfo = container.querySelector('va-additional-info');
        expect(addlInfo).to.have.attribute(
          'trigger',
          'What if I have more than one date range?',
        );

        // subtitle checks
        if (itemId === 'asbestos') {
          getByText(`Hazard 1 of 2: ${ADDITIONAL_EXPOSURES.asbestos}`, {
            exact: false,
          });
          expect(pageSchema.title(formData)).to.equal(
            `Hazard 1 of 2: ${ADDITIONAL_EXPOSURES.asbestos}`,
          );
        } else if (itemId === 'mos') {
          getByText(`Hazard 2 of 2: ${ADDITIONAL_EXPOSURES.mos}`, {
            exact: false,
          });
          expect(pageSchema.title(formData)).to.equal(
            `Hazard 2 of 2: ${ADDITIONAL_EXPOSURES.mos}`,
          );
        } else {
          getByText(ADDITIONAL_EXPOSURES[itemId]);
          expect(pageSchema.title(formData)).to.equal(
            `${ADDITIONAL_EXPOSURES[itemId]}`,
          );
        }
      });

      it(`should submit without dates for ${itemId}`, () => {
        pageSubmitTest(
          schemas[`additional-exposure-${itemId}`],
          formData,
          true,
        );
      });

      it(`should submit with both dates for ${itemId}`, () => {
        const data = JSON.parse(JSON.stringify(formData));
        data.toxicExposure.otherExposuresDetails = {};
        data.toxicExposure.otherExposuresDetails[itemId] = {
          startDate: '2020-05-19',
          endDate: '2021-11-30',
        };

        pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, true);
      });
    });
});
