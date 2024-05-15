import React from 'react';

import {
  VaBreadcrumbs,
  VaButton,
  VaFileInput,
  VaSegmentedProgressBar,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitToSimpleForms } from '../actions';
import {
  getBreadcrumbList,
  getFormNumber,
  getFormUploadContent,
  handleRouteChange,
} from '../helpers';

const UploadPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const confirmationCode = useSelector(
    state => state?.formUpload?.uploads?.confirmationCode,
  );

  const location = useLocation();
  const formNumber = getFormNumber(location);
  const formUploadContent = getFormUploadContent(formNumber);
  const breadcrumbList = getBreadcrumbList(formNumber);

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <VaBreadcrumbs
        breadcrumbList={breadcrumbList}
        onRouteChange={({ detail }) => handleRouteChange({ detail }, history)}
      />
      <h1>{`Upload VA Form ${formNumber}`}</h1>
      <p>{formUploadContent}</p>
      <div>
        <VaSegmentedProgressBar
          current={1}
          total={3}
          labels="Upload your file;Review your information;Submit your form"
        />
      </div>
      <h3>Upload your file</h3>
      <p>
        You’ll need to scan your document onto the device you’re using to submit
        this application, such as your computer, tablet, or mobile phone. You
        can upload your document from there.
      </p>
      <div>
        <p>Guidelines for uploading a file:</p>
        <ul>
          <li>You can upload a .pdf, .jpeg, or .png file</li>
          <li>Your file should be no larger than 25MB</li>
        </ul>
      </div>
      <VaFileInput
        accept=".pdf,.jpeg,.png"
        error=""
        hint={null}
        label={`Upload VA Form ${formNumber}`}
        name="form-upload-file-input"
        onVaChange={e =>
          dispatch(submitToSimpleForms(formNumber, e.detail.files[0]))
        }
        uswds
      />
      <span>
        <VaButton secondary text="<< Back" onClick={history.goBack} />
        <VaButton
          primary
          text="Continue >>"
          onClick={() =>
            history.push(`/${formNumber}/review`, {
              state: { confirmationCode },
            })
          }
        />
      </span>
      <div className="need-help-footer">
        <h2 className="vads-u-padding-bottom--0p5 vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary">
          Need help?
        </h2>
        <p>
          You can call us at <va-telephone contact="8772228387" /> (
          <va-telephone contact="8008778339" tty />
          ). We’re here Monday through Friday, 8:00 a.m to 9:00 p.m ET.
        </p>
      </div>
    </div>
  );
};

export default UploadPage;