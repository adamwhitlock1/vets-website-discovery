import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { loincCodes, dischargeSummarySortFields } from '../../util/constants';

const CareSummariesAndNotesListItem = props => {
  const { record } = props;
  const isDischargeSummary = record.type === loincCodes.DISCHARGE_SUMMARY;

  const admDate = dischargeSummarySortFields.ADMISSION_DATE;
  const disDate = dischargeSummarySortFields.DISCHARGE_DATE;
  const entDate = dischargeSummarySortFields.DATE_ENTERED;
  const fieldMappings = {
    [disDate]: { label: 'discharged', dateProperty: 'dischargeDate' },
    [entDate]: { label: 'entered', dateProperty: 'dateEntered' },
    [admDate]: { label: 'admitted', dateProperty: 'admissionDate' },
  };

  const dsDisplayDate = note => {
    const field = fieldMappings[note.sortByField] || fieldMappings[admDate];
    return note[field.dateProperty];
  };

  const dischargeSummaryDateField = note => {
    const field = fieldMappings[note.sortByField] || fieldMappings[admDate];
    const dateLabel = field.label;
    const dateValue = note[field.dateProperty];

    return (
      <>
        <span className="vads-u-display--inline">Date {dateLabel}: </span>
        <span className="vads-u-display--inline" data-dd-privacy="mask">
          {dateValue}
        </span>
      </>
    );
  };

  return (
    <va-card
      background
      class="record-list-item vads-u-padding-y--2p5 vads-u-margin-bottom--2p5 vads-u-padding-x--3"
      data-testid="record-list-item"
    >
      {/* web view header */}
      <Link
        to={`/summaries-and-notes/${record.id}`}
        data-dd-privacy="mask"
        className="no-print"
      >
        <div className="vads-u-font-weight--bold vads-u-margin-bottom--0p5">
          {record.name}
          <span className="sr-only" data-testid="sr-note-date">
            {`on ${isDischargeSummary ? dsDisplayDate(record) : record.date}`}
          </span>
        </div>
      </Link>

      {/* print view header */}
      <h2 className="print-only" aria-hidden="true" data-dd-privacy="mask">
        {record.name}
      </h2>

      {/* fields */}
      <div className="vads-u-margin-bottom--0p5" data-testid="note-item-date">
        {isDischargeSummary && dischargeSummaryDateField(record)}
        {!isDischargeSummary && (
          <span className="vads-u-display--inline" data-dd-privacy="mask">
            Date entered: {record.date}
          </span>
        )}
      </div>
      <div className="vads-u-margin-bottom--0p5" data-dd-privacy="mask">
        {record.location}
      </div>
      <div>
        <span className="vads-u-display--inline">
          {isDischargeSummary ? 'Discharged by ' : 'Written by '}
        </span>
        <span className="vads-u-display--inline" data-dd-privacy="mask">
          {isDischargeSummary ? record.dischargedBy : record.writtenBy}
        </span>
      </div>
    </va-card>
  );
};

export default CareSummariesAndNotesListItem;

CareSummariesAndNotesListItem.propTypes = {
  record: PropTypes.object,
};
