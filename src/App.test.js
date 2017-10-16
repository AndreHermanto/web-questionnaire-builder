import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import App from './App';

it('renders without crashing', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<App />);
  const result = renderer.getRenderOutput();
  expect(!!result).toBe(true);
});
