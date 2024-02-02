import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns/yesNoPattern';

/* @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'You already have an intent to file for compensation',
      'Our records show that you already have an intent to file for pension.',
    ),
    benefitSelectionPension: yesNoUI({
      title: 'Do you also intend to file a claim for pension?',
      labelHeaderLevel: '3',
      labels: {
        Y: 'Yes, I want to submit an intent to file for a pension claim',
        N: 'No, I don’t intend to file a claim for pension',
      },
      errorMessages: {
        required: 'Please answer if you intend to file a claim for pension',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      benefitSelectionPension: yesNoSchema,
    },
    required: ['benefitSelectionPension'],
  },
};