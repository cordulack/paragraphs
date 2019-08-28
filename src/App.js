import React, { Component } from 'react';

import { baseText } from './baseText.js';

class TextGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfParagraphs: 25,
      minWordCount : 20,
      showParagraphNumbers: false,
      showWordCount : false,
      generatedText: [],
    };

    this.generateText = this.generateText.bind(this);
    this.handleNumOfParagraphChange = this.handleNumOfParagraphChange.bind(this);
    this.handleMinWordCountChange = this.handleMinWordCountChange.bind(this);
    this.handleAddParagraphNumberChange = this.handleAddParagraphNumberChange.bind(this);
    this.handleAddWordCountChange = this.handleAddWordCountChange.bind(this);
    this.handleCopyButtonClick = this.handleCopyButtonClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
    this.generateText();
  }

  generateText() {
    const baseText = this.getBaseText();
    const paragraphs = this.generateParagraphs(baseText, this.state.numberOfParagraphs);
    this.setState({
      generatedText: paragraphs
    });
  }

  generateParagraphs( baseText, numberOfParagraphs){
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
      if(wordCount < this.state.minWordCount) {
        continue;
      }

      const formattedWordCount = this.state.showWordCount ? `(${wordCount})` : '';
      const paragraphNumber = this.state.showParagraphNumbers ? `${currentParagraphNumber} - ` : '';

      formattedParagraphs.push(`${paragraphNumber} ${paragraphs[i]} ${formattedWordCount}`);
      currentParagraphNumber++;
    }

    return formattedParagraphs;
  }

  handleNumOfParagraphChange(event) {
    this.setState({
      numberOfParagraphs: event.target.value
    });
  }

  handleAddParagraphNumberChange(event) {
    this.setState({
      showParagraphNumbers: event.target.checked
    });
  }

  handleAddWordCountChange(event) {
    this.setState({
      showWordCount: event.target.checked
    });
  }

  handleMinWordCountChange(event) {
    this.setState({
      minWordCount: event.target.value
    });
  }

  handleCopyButtonClick() {
    const text = document.querySelector('.generated-text').innerText;

    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.parentNode.removeChild(textArea);
    this.toggleCopyButtonText();
    setTimeout(this.toggleCopyButtonText, 750);
  }

  toggleCopyButtonText() {
    document.querySelector('.copy-button-text').classList.toggle('hide');
    document.querySelector('.icon-done').classList.toggle('hide');
  }

  handleKeyDown(event) {
    if(event.key === 'Enter'){
      this.generateText();
    }
  }

  getBaseText() {
    return baseText;
  }

  render(){
    return(
    <div className="text-generator">
      <div className="u-list-style-none menu">
      <div className="menu-item">
      <label>
        Number of Paragraphs
        <input
          type="number"
          min={1}
          value={this.state.numberOfParagraphs}
          onChange={this.handleNumOfParagraphChange}
          onKeyDown={this.handleKeyPress}
        />
      </label>
      </div>
      <div className="menu-item">
        <label>Min. Words in Paragraph
        <input
          type="number"
          min="0"
          value={this.state.minWordCount}
          onChange={this.handleMinWordCountChange}
        />
        </label>
      </div>
      <div className="menu-item"><label>Paragraph Numbers<input type="checkbox" onChange={this.handleAddParagraphNumberChange}/></label></div>
      <div className="menu-item"><label>Word Count<input type="checkbox" onChange={this.handleAddWordCountChange}/></label></div>
      <div className="buttons">
        <button onClick={this.generateText}>Refresh Paragraphs</button>
        <button className="copy-button" onClick={this.handleCopyButtonClick}>
          <svg className="icon-done hide" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="white" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
          <span className="copy-button-text">Copy</span>
        </button>
      </div>
    </div>
      <div className={this.state.generatedText.length !== 0 ? "generated-text u-bg-image-none" :"generated-text"}>
        {this.state.generatedText.map( (paragraph, i) => {
          return <p key={i}>{paragraph}</p>
        })}
      </div>
    </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <TextGenerator className='text-generator'/>
      </div>
    );
  }
}

export default App;
