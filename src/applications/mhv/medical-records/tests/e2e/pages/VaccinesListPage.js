// import defaultVaccines from '../fixtures/Vaccines.json';
import defaultVaccines from '../fixtures/vaccines/vaccines.json';
import defaultVaccineDetail from '../fixtures/vaccines/vaccine-8261.json';

class VaccinesListPage {
  clickGotoVaccinesLink = (
    Vaccines = defaultVaccines,
    waitForVaccines = false,
  ) => {
    cy.intercept('GET', '/my_health/v1/medical_records/vaccines', Vaccines).as(
      'VaccinesList',
    );
    cy.get('[href="/my-health/medical-records/vaccines"]').click();
    if (waitForVaccines) {
      cy.wait('@VaccinesList');
    }
  };

  clickVaccinesDetailsLink = (
    _VaccinesIndex = 0,
    VaccinesDetails = defaultVaccineDetail,
  ) => {
    cy.intercept(
      'GET',
      `/my_health/v1/medical_records/vaccines/${VaccinesDetails.id}`,
      VaccinesDetails,
    ).as('VaccinesDetails');
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_VaccinesIndex)
      .click();
    cy.wait('@VaccinesDetails');
  };
}

export default new VaccinesListPage();