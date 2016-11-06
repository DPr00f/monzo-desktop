import genericRequestReducer from '../../src/reducers/genericRequest';
import {
  REQUEST_STARTED,
  REQUEST_COMPLETED,
  REQUEST_FAILED
} from '../../src/actions/types';

describe('genericRequest Reducer ::', () => {
  describe('action.type = REQUEST_STARTED ::', () => {
    it('Needs to remove any message and set loading to true', () => {
      const prevState = {
        loading: false,
        message: 'Sample message'
      };
      const nextState = {
        loading: true,
        message: ''
      };
      deepFreeze(prevState);
      expect(genericRequestReducer(prevState, { type: REQUEST_STARTED }))
            .to.deep.equal(nextState);
    });
  });
  describe('action.type = REQUEST_COMPLETED ::', () => {
    it('Needs to remove any message and set loading to false', () => {
      const prevState = {
        loading: true,
        message: 'Sample message'
      };
      const nextState = {
        loading: false,
        message: ''
      };
      deepFreeze(prevState);
      expect(genericRequestReducer(prevState, { type: REQUEST_COMPLETED }))
            .to.deep.equal(nextState);
    });
  });
  describe('action.type = REQUEST_FAILED ::', () => {
    it('Needs to set the action message and set loading to false', () => {
      const prevState = {
        loading: true,
        message: ''
      };
      const nextState = {
        loading: false,
        message: 'Action message'
      };
      deepFreeze(prevState);
      expect(genericRequestReducer(prevState, { type: REQUEST_FAILED, message: 'Action message' }))
            .to.deep.equal(nextState);
    });
  });
});
