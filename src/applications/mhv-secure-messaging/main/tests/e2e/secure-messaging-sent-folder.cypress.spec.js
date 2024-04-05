import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessagesSentPage from './pages/PatientMessageSentPage';
import { AXE_CONTEXT, Data } from './utils/constants';
import FolderLoadPage from './pages/FolderLoadPage';

describe('Secure Messaging Sent Folder checks', () => {
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    PatientMessagesSentPage.loadMessages();
  });

  it('Verify folder header', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientMessagesSentPage.verifyFolderHeader('Sent');
    PatientMessagesSentPage.verifyResponseBodyLength();
  });

  it('Verify filter works correctly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientMessagesSentPage.inputFilterData('test');
    PatientMessagesSentPage.filterMessages();
    PatientMessagesSentPage.verifyFilterResults('test');
  });

  it('Verify clear filter btn works correctly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientMessagesSentPage.inputFilterData('any');
    PatientMessagesSentPage.filterMessages();
    PatientMessagesSentPage.clearFilter();
    PatientMessagesSentPage.verifyFilterFieldCleared();
  });

  it('Check sorting works properly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientMessagesSentPage.verifySorting();
  });

  it('Checks for "End of conversations in this folder" text', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    cy.get('.endOfThreads').should('not.exist');
    cy.get('.usa-pagination__list li').then(pagesList => {
      const lastPageIndex = pagesList.length - 2;
      FolderLoadPage.navigateToLastPage(lastPageIndex);
      cy.get('.endOfThreads').should(
        'have.text',
        Data.END_CONVERSATION_IN_FOLDER,
      );
    });
    FolderLoadPage.verifyPaginationElements();
  });
});