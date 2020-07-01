import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory,
} from "react-router-dom";

function TextGenerator() {
  let query = useQuery();
  let history = useHistory();

  const urlParams = getURLParamValues();

  const [textType, setTextType] = useState(urlParams.textType);
  const [numberOfParagraphs, setNumberOfParagraphs] = useState(urlParams.numberOfParagraphs);
  const [minWordCount, setMinWordCount] = useState(urlParams.minWordCount);
  const [showParagraphNumbers, setShowParagraphNumbers] = useState(urlParams.showParagraphNumbers);
  const [showWordCount, setShowWordCount] = useState(urlParams.showWordCount);
  const [generatedText, setGeneratedText] = useState([]);

  // Get the current location.
  const location = history.location;

  useEffect(()=> {
    generateText();
  }, []);

  function getURLParamValues() {
    return {
      'textType': query.get('textType') === 'verne' ? 'verne' : 'lorem',
      'numberOfParagraphs': query.get('paragraphs') ? parseInt(query.get('paragraphs')) : 20,
      'minWordCount': query.get('words') ? parseInt(query.get('words')) : 20,
      'showParagraphNumbers' : query.get('pnumbers') === "1",
      'showWordCount': query.get('wordcount') === "1",
    };
  }

  function generateText() {
    const textChoice = textType === 'verne' ? 'Verne' : 'Lorem';

    import('./text-files/baseText' + textChoice + '.js')
      .then(({ baseText }) => {
        const paragraphs = generateParagraphs(baseText, numberOfParagraphs);
        setGeneratedText(paragraphs);
      })
      .catch(err => {
        console.log(err);
      });
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

  function changeURL() {
    query.set('paragraphs', numberOfParagraphs);
    query.set('words', minWordCount);
    query.set('pnumbers', `${showParagraphNumbers ? '1': '0'}`);
    query.set('wordcount', `${showWordCount ? '1' : '0'}`);
    query.set('textType', textType);
    window.history.replaceState({}, '', `${location.pathname}?${query}`);
  }

  return(
    <div className="text-generator">
      <div className="u-list-style-none menu">
      <div className="menu-item">
        <label>
          Text
        </label>
        <select value={textType} onChange={ e => setTextType(e.target.value)}>
          <option value="lorem">Lorem</option>
          <option value="verne">Jules Verne, From the Earth to the Moon</option>
        </select>
      </div>
      <div className="menu-item">
      <label>
        Number of Paragraphs
        <input
          className="paragraph-number"
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
          className="minWordCount"
          type="number"
          min="0"
          value={minWordCount}
          onChange={ e => setMinWordCount(e.target.value)}
        />
        </label>
      </div>
      <div className="menu-item"><label>Paragraph Numbers<input type="checkbox" checked={showParagraphNumbers} onChange={ e => setShowParagraphNumbers(e.target.checked)}/></label></div>
      <div className="menu-item"><label>Word Count<input type="checkbox" checked={showWordCount} onChange={ e => setShowWordCount(e.target.checked)}/></label></div>
      <div className="buttons">
        <button onClick={ () => {
          generateText();
          changeURL();
        }
        }>Refresh Paragraphs</button>
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
    <Router>
      <div className="App">
        <Switch>
          <Route path="/">
            <TextGenerator className='text-generator'/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default App;
