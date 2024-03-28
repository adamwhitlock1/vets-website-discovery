import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { DirectDepositWarning } from '../../../helpers';

const directDeposit = {
  uiSchema: {
    ...titleUI(
      'Direct deposit for Veterans Pension benefits',
      DirectDepositWarning,
    ),
    'view:usingDirectDeposit': yesNoUI({
      title: 'Do you have a bank account to use for direct deposit?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:usingDirectDeposit': yesNoSchema,
    },
    required: ['view:usingDirectDeposit'],
  },
};

export { directDeposit };