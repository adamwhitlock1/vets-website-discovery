import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { errorMessages } from '../constants';

import {
  informalConferenceTitle,
  InformalConferenceDescription,
  informalConferenceHint,
  informalConferenceLabels,
  informalConferenceDescriptions,
} from '../content/InformalConference';
import { validateConferenceChoice } from '../validations';

const informalConference = {
  uiSchema: {
    'ui:description': InformalConferenceDescription,
    informalConference: {
      ...radioUI({
        title: informalConferenceTitle,
        hint: informalConferenceHint,
        labels: informalConferenceLabels,
        descriptions: informalConferenceDescriptions,
        enableAnalytics: true,
        errorMessages: {
          required: errorMessages.informalConferenceContactChoice,
        },
      }),
      'ui:validations': [validateConferenceChoice],
    },
  },
  schema: {
    type: 'object',
    required: ['informalConference'],
    properties: {
      informalConference: radioSchema(['me', 'rep', 'no']),
    },
  },
};

export default informalConference;
