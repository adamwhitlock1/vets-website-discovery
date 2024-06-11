import {
  txtLine,
  txtLineDotted,
} from '@department-of-veterans-affairs/mhv/exports';
import { loincCodes } from '../constants';

export const parseCareSummariesAndNotes = records => {
  return `
${txtLine}
2) Care summaries and notes

This report only includes care summaries and notes from 2013 and later.
For after-visit summaries, (summaries of your appointments with VA providers), go to your appointment records.

${records
    .map(
      record =>
        `${
          record.type === loincCodes.PHYSICIAN_PROCEDURE_NOTE ||
          record.type === loincCodes.CONSULT_RESULT
            ? `
${record.name}
${txtLineDotted}

Details
  
  Date: ${record.date}
  Location: ${record.location}
  Signed by: ${record.signedBy}
  Co-signed by: ${record.coSignedBy}
  Signed on: ${record.dateSigned}

Notes
  ${record.note}
`
            : `

${record.name}
${txtLineDotted}

Details
  Location: ${record.location}
  Admitted on: ${record.admissionDate}
  Discharged on: ${record.dischargeDate}
  Discharged by: ${record.dischargedBy}

Summary
  ${record.summary}
              `
        }`,
    )
    .join('')}

`;
};