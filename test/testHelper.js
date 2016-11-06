import _$ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import jsdom from 'jsdom';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import sinonChai from 'sinon-chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from '../src/reducers';
import deepFreeze from 'deep-freeze';
import sinon from 'sinon';

process.env.NODE_ENV = 'testing';

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;
const $ = _$(window);

chaiJquery(chai, chai.util, $);
chai.use(sinonChai);

function renderComponent(ComponentClass, props = {}, state = {}) {
  const componentInstance = TestUtils.renderIntoDocument(
    <Provider store={createStore(reducers, state)}>
      <ComponentClass {...props} />
    </Provider>
  );

  return $(ReactDOM.findDOMNode(componentInstance));
}

$.fn.simulate = function simulate(eventName, value) {
  if (value) {
    this.val(value);
  }
  TestUtils.Simulate[eventName](this[0]);
};

global.expect = expect;
global.sinon = sinon;
global.renderComponent = renderComponent;
global.deepFreeze = deepFreeze;
global.callMiddleWare = function callMiddleWare(middleWare, action) {
  const nextSpy = sinon.spy();
  const next = (nextAction) => {
    nextSpy(nextAction);
  };
  const dispatcherFakeObject = {
    dispatch: (nextAction) => {
      next(nextAction);
    }
  };
  middleWare(dispatcherFakeObject)(next)(action);
  return nextSpy;
};
global.getServerReqAndRes = () => {
  return {
    response: {
      status: function status(value) {
        this.statusCode = value;
        return this;
      },
      json: () => {},
      redirect: () => {}
    },
    request: {
      session: {},
      query: {}
    }
  };
};
