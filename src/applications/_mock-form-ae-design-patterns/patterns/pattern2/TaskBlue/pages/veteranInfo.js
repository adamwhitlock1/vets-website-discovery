import VeteranInformation from '../VeteranInformation';

const veteranInformation = {
  uiSchema: {
    'ui:description': VeteranInformation,
    'ui:options': {
      hideOnReview: true,
    },
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

export default veteranInformation;
