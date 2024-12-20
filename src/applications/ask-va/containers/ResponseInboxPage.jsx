import {
  VaAlert,
  VaButton,
  VaFileInputMultiple,
  VaIcon,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import BreadCrumbs from '../components/BreadCrumbs';
import NeedHelpFooter from '../components/NeedHelpFooter';
import { ServerErrorAlert } from '../config/helpers';
import { envUrl, RESPONSE_PAGE, URL } from '../constants';
import { formatDate } from '../utils/helpers';

const attachmentBox = fileName => (
  <div className="attachment-box vads-u-display--flex vads-u-justify-content--space-between vads-u-background-color--gray-light-alt">
    <p>
      <strong>{fileName}</strong>
    </p>
    <p>
      {' '}
      <VaButton onClick={() => {}} secondary text={RESPONSE_PAGE.DELETE_FILE} />
    </p>
  </div>
);
const emptyMessage = message => (
  <p className="vads-u-background-color--gray-light-alt empty-message">
    {message}
  </p>
);
const getReplySubHeader = messageType => messageType.split(':')[1].trim();

const ResponseInboxPage = ({ router }) => {
  const [error, setError] = useState(false);
  const [sendReply, setSendReply] = useState({ reply: '', attachments: [] });
  const [loading, setLoading] = useState(true);
  const [inquiryData, setInquiryData] = useState([]);
  const getLastSegment = () => {
    const pathArray = window.location.pathname.split('/');
    return pathArray[pathArray.length - 1];
  };
  const inquiryId = getLastSegment();

  const options = {
    body: JSON.stringify(sendReply),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const postApiData = url => {
    setLoading(true);

    return apiRequest(url, options)
      .then(() => {
        setLoading(false);
        router.push('/response-sent');
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  };

  const handleInputChange = event => {
    setSendReply({ ...sendReply, reply: event.target.value });
  };

  const handleSubmit = () => {
    if (sendReply.reply) {
      postApiData(`${envUrl}${URL.GET_INQUIRIES}${inquiryId}${URL.SEND_REPLY}`);
    }
  };

  const getApiData = url => {
    setLoading(true);

    return apiRequest(url)
      .then(res => {
        setInquiryData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  };

  useEffect(
    () => {
      if (inquiryId) getApiData(`${envUrl}${URL.GET_INQUIRIES}/${inquiryId}`);
    },
    [inquiryId],
  );

  useEffect(
    () => {
      focusElement('h1');
    },
    [loading],
  );

  if (error) {
    return (
      <va-alert status="info" className="vads-u-margin-y--4">
        <ServerErrorAlert />
      </va-alert>
    );
  }

  if (loading) {
    return (
      <va-loading-indicator label="Loading" message="Loading..." set-focus />
    );
  }

  return !error ? (
    <div className="row vads-u-padding-x--1">
      <BreadCrumbs currentLocation={location.pathname} />
      <div className="usa-width-two-thirds medium-8 columns vads-u-padding--0">
        <h1>{RESPONSE_PAGE.QUESTION_DETAILS}</h1>
        <dl className="dashboard-dl">
          <div className="vads-u-margin-bottom--1p5">
            <dt className="sr-only">Status</dt>
            <dd>
              <span className="usa-label vads-u-font-weight--normal vads-u-font-family--sans">
                {inquiryData.attributes.status}
              </span>
            </dd>
          </div>
          <div className="vads-u-margin-bottom--1">
            <dt className="vads-u-display--inline vads-u-font-weight--bold">
              Submitted:
            </dt>
            <dd className="vads-u-display--inline">
              {' '}
              {formatDate(inquiryData.attributes.createdOn)}
            </dd>
          </div>
          <div className="vads-u-margin-bottom--1">
            <dt className="vads-u-display--inline vads-u-font-weight--bold">
              Last updated:
            </dt>
            <dd className="vads-u-display--inline">
              {' '}
              {formatDate(inquiryData.attributes.lastUpdate)}
            </dd>
          </div>
          <div className="vads-u-margin-bottom--1">
            <dt className="vads-u-display--inline vads-u-font-weight--bold">
              Category:
            </dt>
            <dd className="vads-u-display--inline">
              {' '}
              {inquiryData.attributes.category}
            </dd>
          </div>
          <div>
            <dt className="vads-u-display--inline vads-u-font-weight--bold">
              Reference number:
            </dt>
            <dd className="vads-u-display--inline">
              {' '}
              {inquiryData.attributes.inquiryNumber}
            </dd>
          </div>
        </dl>

        <div className="vads-l-row vads-u-justify-content--space-between vads-u-align-items--baseline">
          <h2 className="vads-u-margin-y--2">
            {RESPONSE_PAGE.YOUR_CONVERSATION}
          </h2>
          <button
            className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center va-button-link vads-u-text-decoration--none"
            type="button"
            onClick={() => window.print()}
          >
            <span className="vads-u-color--primary">
              <VaIcon
                size={3}
                icon="print"
                className="vads-u-margin-right--1"
              />
            </span>
            <span className="vads-u-font-weight--bold vads-u-color--primary vads-u-font-size--h3">
              PRINT
            </span>
          </button>
        </div>

        <hr
          role="presentation"
          className="vads-u-border-color--gray-lightest"
        />
        {inquiryData.attributes.reply.data.length === 0 ? (
          <div className="no-messages">
            {emptyMessage(RESPONSE_PAGE.EMPTY_INBOX)}
          </div>
        ) : (
          <div className="inbox-replies">
            <va-accordion
              bordered
              open-single={inquiryData.attributes.reply.data.length === 1}
            >
              {inquiryData.attributes.reply.data.map((message, ix) => (
                <va-accordion-item
                  key={message.id}
                  header={message.modifiedOn}
                  subHeader={getReplySubHeader(message.messageType)}
                  open={inquiryData.attributes.reply.data.length - 1 === ix}
                  level={3}
                >
                  <p className="vads-u-margin--0">{message.attributes.reply}</p>
                  {message.attributes.attachmentNames.length > 0 && (
                    <p className="vads-u-font-size--h3">
                      {RESPONSE_PAGE.ATTACHMENTS}
                    </p>
                  )}
                  {message.attributes.attachmentNames.length > 0 &&
                    message.attributes.attachmentNames.map(attachment => (
                      <div key={attachment.id}>
                        {attachmentBox(attachment.name)}
                      </div>
                    ))}
                </va-accordion-item>
              ))}
            </va-accordion>
          </div>
        )}

        <h2 className="vads-u-margin-bottom--0">{RESPONSE_PAGE.SEND_REPLY}</h2>
        <form className="vads-u-margin-bottom--5" onSubmit={handleSubmit}>
          <fieldset>
            <va-textarea
              class="resize-y"
              label={RESPONSE_PAGE.YOUR_MESSAGE}
              name="reply message"
              onInput={handleInputChange}
              value={sendReply.reply}
              required
            />

            <VaFileInputMultiple
              label="Select optional files to upload"
              hint="You can upload a .pdf, .jpeg, or .png file. that is less than 25 MB in size"
              name="my-file-input"
              onClick={() => {
                setSendReply({
                  ...sendReply,
                  attachments: [
                    ...sendReply.attachments,
                    {
                      name: 'new_file_name.pdf',
                      file: 'c2RncmRmaHMgZGZmc2ZkZ3Nj',
                    },
                  ],
                });
              }}
            />

            <VaButton
              onClick={handleSubmit}
              primary
              className="vads-u-margin-top--2"
              text={RESPONSE_PAGE.SUBMIT_MESSAGE}
            />
          </fieldset>
        </form>
        <NeedHelpFooter />
      </div>
    </div>
  ) : (
    <VaAlert status="info" className="row vads-u-margin-y--4">
      <ServerErrorAlert />
      <Link aria-label="Go sign in" to="/contact-us/ask-va-too/introduction">
        <VaButton
          onClick={() => {}}
          primary
          text="Sign in with Approved User"
        />
      </Link>
    </VaAlert>
  );
};

ResponseInboxPage.propTypes = {
  router: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool,
  params: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
  };
}

export default connect(mapStateToProps)(withRouter(ResponseInboxPage));
