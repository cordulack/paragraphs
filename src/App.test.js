import React from 'react';
import { mount } from 'enzyme';

import TextGenerator from './App';

test('Paragraph Number Input should initially contain a value of 25', () => {
  const textGeneratorWrapper = mount(<TextGenerator />);
  const numberOfParagraphs = textGeneratorWrapper.find('.paragraph-number').props().value;
  expect(numberOfParagraphs).toStrictEqual(25);
  textGeneratorWrapper.unmount();
});

test('Minimum Word Count should initially contain a value of 20', () => {
  const textGeneratorWrapper = mount(<TextGenerator />);
  const numberOfParagraphs = textGeneratorWrapper.find('.minWordCount').props().value;
  expect(numberOfParagraphs).toStrictEqual(20);
  textGeneratorWrapper.unmount();
});

test('Show Paragraph Numbers should start off unchecked', () => {
  const textGeneratorWrapper = mount(<TextGenerator />);
  const showParagraphNumbers = textGeneratorWrapper.find('.show-paragraph-numbers').props().value;
  expect(showParagraphNumbers).toBe(false);
  textGeneratorWrapper.unmount();
});

test('Show WordCount should start off unchecked', () => {
  const textGeneratorWrapper = mount(<TextGenerator />);
  const showWordCount = textGeneratorWrapper.find('.show-word-count').props().value;
  expect(showWordCount).toBe(false);
  textGeneratorWrapper.unmount();
});

test('Example Text should initially have 25 paragraphs', () => {
  const textGeneratorWrapper = mount(<TextGenerator />);
  const paragraphs = textGeneratorWrapper.find('p');
  expect(paragraphs).toHaveLength(25);
  textGeneratorWrapper.unmount();
});

test('Example text should change after clicking the Refresh Paragraphs buttons', () => {
  const textGeneratorWrapper = mount(<TextGenerator />);
  const originalParagraphs = textGeneratorWrapper.find('.generated-text');

  textGeneratorWrapper.find('.refresh-button').simulate('click');

  const newParagraphs = textGeneratorWrapper.find('.generated-text');
  expect(originalParagraphs).not.toEqual(newParagraphs);
  textGeneratorWrapper.unmount();
});

test('Example text should contain the number of paragraphs we have entered', () => {
  const textGeneratorWrapper = mount(<TextGenerator/>);
  textGeneratorWrapper.find('.paragraph-number').simulate('change', { target: {value: 5}});

  // Simulate a click to refresh the paragraphs to generate the number we want
  textGeneratorWrapper.find('.refresh-button').simulate('click');

  const numberOfParagraphs = textGeneratorWrapper.find('p').length;
  expect(numberOfParagraphs).toEqual(5);
});

test('Example text should contain paragraph numbers when Show Paragraph Numbers is checked', () => {
  const textGeneratorWrapper = mount(<TextGenerator />);
  // Since this checkbox sets the state on change (instead of just doing something when clicked, we use 'change')
  textGeneratorWrapper.find('.show-paragraph-numbers').simulate('change', { target: {checked: true}});

  // Simulate a click to refresh the paragraphs that should now include a paragraph number
  textGeneratorWrapper.find('.refresh-button').simulate('click');

  // Get all paragraphs, take the first one, then grab its text
  const firstParagraphText = textGeneratorWrapper.find('p').at(0).text();

  // Check to see if the first paragraph has our formatted paragraph number
  expect(firstParagraphText).toEqual(expect.stringContaining('1 - '));

  textGeneratorWrapper.unmount();
});

test('Example text should contain word count when Show WordCount Numbers is checked', () => {
  const textGeneratorWrapper = mount(<TextGenerator />);
  // Since this checkbox sets the state on change (instead of just doing something when clicked, we use 'change')
  textGeneratorWrapper.find('.show-word-count').simulate('change', { target: {checked: true}});

  // Simulate a click to refresh the paragraphs that should now include a paragraph number
  textGeneratorWrapper.find('.refresh-button').simulate('click');

  const firstParagraphText = textGeneratorWrapper.find('p').at(0).text();

  // Check to see if the first paragraph has our formatted word count number
  expect(firstParagraphText).toEqual(expect.stringMatching(/\(\d+\)/));

  textGeneratorWrapper.unmount();
});


