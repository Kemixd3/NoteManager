import React, { useState, useEffect, useRef } from 'react';

function EditableHTML({ initialContent }) {
  const [htmlContent, setHtmlContent] = useState(initialContent);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = htmlContent;
      applyMaxWidthToImages(contentRef.current);
    }
  }, [htmlContent]);

  const handleHtmlChange = () => {
    if (contentRef.current) {
      setHtmlContent(contentRef.current.innerHTML);
    }
  };

  const applyMaxWidthToImages = (element) => {
    const images = element.querySelectorAll('img');
    images.forEach((image) => {
      image.style.maxWidth = '100%';
    });
  };

  const handleSaveClick = () => {
    // Save the HTML content
    console.log('Content saved:', htmlContent);
  };

  const toggleBold = () => {
    document.execCommand('bold', false, null);
  };

  const toggleItalic = () => {
    document.execCommand('italic', false, null);
  };

  const toggleHeader = (level) => {
    document.execCommand('formatBlock', false, `h${level}`);
  };

  const toggleNormalText = () => {
    const isBold = document.queryCommandState('bold');
    const isItalic = document.queryCommandState('italic');

    if (isBold) {
      document.execCommand('bold', false, null);
    }

    if (isItalic) {
      document.execCommand('italic', false, null);
    }
  };

  const divStyles = {
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: 'white',
    width: '210mm',
    margin: 'auto',
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={toggleBold}>Bold</button>
        <button onClick={toggleItalic}>Italic</button>
        <button onClick={() => toggleHeader(1)}>Header 1</button>
        <button onClick={() => toggleHeader(2)}>Header 2</button>
        <button onClick={toggleNormalText}>Normal</button>
      </div>
      <div
        ref={contentRef}
        contentEditable
        onBlur={handleHtmlChange}
        style={divStyles}
      />
      <button onClick={handleSaveClick}>Save</button>
    </div>
  );
}

export default EditableHTML;