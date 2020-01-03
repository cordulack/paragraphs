import React, { useState, useEffect } from 'react';

import { baseText } from './baseText.js';

function TextGenerator() {
  const [numberOfParagraphs, setNumberOfParagraphs] = useState(25);
  const [minWordCount, setMinWordCount] = useState(20);
  const [showParagraphNumbers, setShowParagraphNumbers] = useState(false);
  const [showWordCount, setShowWordCount] = useState(false);
  const [generatedText, setGeneratedText] = useState([]);

  useEffect(()=> {
    generateText();
  }, []);

  useEffect(()=> {
    document.addEventListener("keydown", e => {
      if(e.key === 'Enter'){
        generateText();
      }
    }, false);
  }, []);

  function generateText() {
    const paragraphs = generateParagraphs(baseText, numberOfParagraphs);
    setGeneratedText(paragraphs);
  }

  function generateParagraphs( baseText, numberOfParagraphs){
    // Split the base text into an array at each blank line
    const paragraphs = baseText.split('\n\n');
    const totalParagraphNumber = paragraphs.length;
    // Get a random(ish) number between 0 and the number of paragraphs base text has minus the number of paragraphs requested
    const firstParagraphNumber = Math.floor(Math.random() * (totalParagraphNumber-numberOfParagraphs));

    let currentParagraphNumber = 1;
    let formattedParagraphs = [];
    for(let i = firstParagraphNumber; currentParagraphNumber <= numberOfParagraphs; i++) {
      // if we have run out of paragraphs, just return whatever we have
      if(i > totalParagraphNumber) {
        break;
      }

      if(!paragraphs[i]) {
        continue;
      }
      const wordCount = paragraphs[i].split(" ").length;
      if(wordCount < minWordCount) {
        continue;
      }

      const formattedWordCount = showWordCount ? `(${wordCount})` : '';
      const paragraphNumber = showParagraphNumbers ? `${currentParagraphNumber} - ` : '';

      formattedParagraphs.push(`${paragraphNumber} ${paragraphs[i]} ${formattedWordCount}`);
      currentParagraphNumber++;
    }

    return formattedParagraphs;
  }

  function handleCopyButtonClick() {
    const text = document.querySelector('.generated-text').innerText;

    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.parentNode.removeChild(textArea);
    toggleCopyButtonText();
    setTimeout(toggleCopyButtonText, 750);
  }

  function toggleCopyButtonText() {
    document.querySelector('.copy-button-text').classList.toggle('hide');
    document.querySelector('.icon-done').classList.toggle('hide');
  }

  return(
    <div className="text-generator">
      <div className="u-list-style-none menu">
      <div className="menu-item">
      <label>
        Number of Paragraphs
        <input
          type="number"
          min={1}
          value={numberOfParagraphs}
          onChange={ e => setNumberOfParagraphs(e.target.value)}
        />
      </label>
      </div>
      <div className="menu-item">
        <label>Min. Words in Paragraph
        <input
          type="number"
          min="0"
          value={minWordCount}
          onChange={ e => setMinWordCount(e.target.value)}
        />
        </label>
      </div>
      <div className="menu-item"><label>Paragraph Numbers<input type="checkbox" onChange={ e => setShowParagraphNumbers(e.target.checked)}/></label></div>
      <div className="menu-item"><label>Word Count<input type="checkbox" onChange={ e => setShowWordCount(e.target.checked)}/></label></div>
      <div className="buttons">
        <button onClick={generateText}>Refresh Paragraphs</button>
        <button className="copy-button" onClick={handleCopyButtonClick}>
          <svg className="icon-done hide" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="white" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
          <span className="copy-button-text">Copy</span>
        </button>
      </div>
    </div>
      <div className={generatedText.length !== 0 ? "generated-text u-bg-image-none" :"generated-text"}>
        {generatedText.map( (paragraph, i) => {
          return <p key={i}>{paragraph}</p>
        })}
      </div>
    </div>
    );
}

function App() {
  return (
    <div className="App">
      <TextGenerator className='text-generator'/>
    </div>
  );
}

export default App;
