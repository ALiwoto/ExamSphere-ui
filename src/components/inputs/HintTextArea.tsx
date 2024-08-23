import React, { useState, useRef, useEffect } from 'react';
import './HintTextArea.css'; // We'll create this CSS file

interface HintTextAreaProps {
    options: string[];
    }

const HintTextArea = ({ options }: HintTextAreaProps) => {
  const [inputValue, setInputValue] = useState('');
  const [hint, setHint] = useState('');
  const textareaRef: any = useRef(null);
  const hintRef: any = useRef(null);

  useEffect(() => {
    if (textareaRef.current && hintRef.current) {
      hintRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const matchingOption = options.find(option => 
      option.toLowerCase().startsWith(newValue.toLowerCase())
    );

    if (newValue && matchingOption) {
      setHint(matchingOption.slice(newValue.length));
    } else {
      setHint('');
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Tab' && hint) {
      e.preventDefault();
      setInputValue(inputValue + hint);
      setHint('');
    }
  };

  return (
    <div className="hint-textarea-container">
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="hint-textarea"
      />
      <div ref={hintRef} className="hint-overlay">
        <span className="hint-input">{inputValue}</span>
        <span className="hint-text">{hint}</span>
      </div>
    </div>
  );
};

export default HintTextArea;