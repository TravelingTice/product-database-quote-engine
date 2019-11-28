import React from 'react';

const QuoteList = props => {
  const { isAllSelect, toggleAll, onOpenDeletePanel, onSelect, quote, selectedItems } = props;
  const { items } = quote;
  // add prop 'isSelected' to each item, if it is in the selectedItems array of props, it is set to 'true'
  const itemsArr = [];
  items.forEach(item => {
    let bool = false;
    selectedItems.forEach(selectedItem => {
      if (item.name === selectedItem.name) {
        bool = true;
      }
    });
    if (bool) {
      item.isSelected = true;
    } else {
      item.isSelected = false;
    }
    itemsArr.push(item);
  });

  return (
    <div className="quote-list-container">

      <div className="top-btns">

        <input 
        type="checkbox"
        checked={isAllSelect}
        onChange={() => toggleAll()}
        />

        <button
        className="delete-selected-btn"
        onClick={e => onOpenDeletePanel(e)}>
          Delete selected
        </button>

      </div>

      <ul className="items-list">
        <>
          {itemsArr.map(item => (
            <li key={item._id}>
              <div>
                <input 
                type="checkbox"
                checked={item.isSelected}
                onChange={() => onSelect(item)}/>
                <img 
                src={item.images[0]} 
                alt={item.name}/>
                <span>{item.name}</span>
              </div>
            </li>
          ))}
        </>
      </ul>

    </div>
  );
}

export default QuoteList;