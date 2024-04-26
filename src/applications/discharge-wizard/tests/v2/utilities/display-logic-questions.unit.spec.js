import { expect } from 'chai';
import { responseMatchesRequired } from '../../../utilities/display-logic-questions';
import { RESPONSES } from '../../../constants/question-data-map';

const {
  ARMY,
  NAVY,
  AIR_FORCE,
  COURT_MARTIAL_1,
  COURT_MARTIAL_2,
  COURT_MARTIAL_3,
} = RESPONSES;

describe('utils: display logic for questions', () => {
  it('responseMatchesRequired', () => {
    it(
      'Should return true when the response matches any value in the required array of choices',
    );
    expect(
      responseMatchesRequired(
        [COURT_MARTIAL_1, COURT_MARTIAL_2, COURT_MARTIAL_3],
        COURT_MARTIAL_1,
      ),
    ).to.be.true;

    it(
      'Should return false when the response does not match any value in the requried array of choices',
    );
    expect(responseMatchesRequired([ARMY, NAVY], AIR_FORCE)).to.be.false;
  });
});