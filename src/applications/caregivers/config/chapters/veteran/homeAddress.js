// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { VeteranCountyDescription } from '../../../components/FormDescriptions/AddressCountyDescriptions';
import { addressUI } from '../../../definitions/sharedUI';
import { addressSchema } from '../../../definitions/sharedSchema';
import content from '../../../locales/en/content.json';
import fullSchema from '../../10-10CG-schema.json';

const { address } = fullSchema.definitions;
const inputLabel = content['vet-input-label'];
const inputHint = content['vet-address-street-hint'];

const veteranHomeAddress = {
  uiSchema: {
    ...titleUI(
      content['vet-info-title--address'],
      content['vet-address-description'],
    ),
    veteranAddress: addressUI({
      label: inputLabel,
      hint: inputHint,
      requireCounty: true,
      countyDescription: VeteranCountyDescription,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranAddress: addressSchema(address),
    },
  },
};

export default veteranHomeAddress;