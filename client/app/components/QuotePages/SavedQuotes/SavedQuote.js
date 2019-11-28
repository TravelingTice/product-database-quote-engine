import React from 'react';

const SavedQuote = props => (
  <li key={props.quote._id}>
    <div
    onClick={e => props.onClickQuote(props.quote._id, e)}>
      <p>
      {props.quote.items.map((item, i) => (
        <span key={i}>
        {i < props.quote.items.length - 1 && i < 2 ? (
          <span key={i}>{item.name}, </span>
        ):(
          <>
            {i <= 2 ? (
              <span key={i}>{item.name}.</span>
            ):(
              <>{i === 3 && ( <span>..</span>)}</>
            )}
          </>
        )}
        </span>
      ))}
      <span> (Total {props.quote.items.length})</span>
      </p>
      <span 
      className="timestamp"
      onClick={e => props.onClickQuote(props.quote._id, e)}>
        {props.quote.timeStamp}
      </span>
    </div>
    <span>
      <button 
      className="btn btn-danger"
      onClick={e => props.onOpenPanel(e, props.quote._id)}>Remove</button>
    </span>
  </li>
);

export default SavedQuote;