import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation } from 'react-router-dom';
import LCSearchResult from './LCSearchResult';

function LicenseCertificationSearchResults({ lcResults, fetchingLc, error }) {
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name');

  const itemsPerPage = 5;

  const totalPages = Math.ceil(lcResults.length / itemsPerPage);
  const currentResults = lcResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const handlePageChange = page => {
    setCurrentPage(page);
  };

  if (fetchingLc) {
    return <h2>Loading</h2>;
  }

  if (error) {
    return <p className="">{error}</p>;
  }

  return (
    <div>
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        {lcResults.length !== 0 ? (
          <>
            <div className="row">
              <h1 className="vads-u-text-align--center mobile-lg:vads-u-text-align--left">
                Licenses and Certifications Search Results
              </h1>

              <p className="vads-u-color--gray-dark lc-filter-options">
                Showing {itemsPerPage} of {lcResults.length} results for: {name}
              </p>
              <p className="lc-filter-options">
                <strong>License/Certification Name: </strong>
              </p>
            </div>
            <div className="row">
              <va-accordion openSingle>
                {currentResults.map((result, index) => {
                  return <LCSearchResult key={index} result={result} />;
                })}
              </va-accordion>
            </div>
            <VaPagination
              page={currentPage}
              pages={totalPages}
              maxPageListLength={itemsPerPage}
              onPageSelect={e => handlePageChange(e.detail.page)}
            />
          </>
        ) : (
          <div className="row">
            <h1 className="vads-u-text-align--center mobile-lg:vads-u-text-align--left">
              Licenses and Certifications Search Results
            </h1>

            <p>No results for this search</p>
          </div>
        )}
      </section>
    </div>
  );
}

LicenseCertificationSearchResults.propTypes = {
  error: PropTypes.string,
  fetchingLc: PropTypes.bool.isRequired,
  lcResults: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchingLc: state.licenseCertificationSearch.fetchingLc,
  hasFetchedOnce: state.licenseCertificationSearch.hasFetchedOnce,
  lcResults: state.licenseCertificationSearch.lcResults,
});

export default connect(mapStateToProps)(LicenseCertificationSearchResults);