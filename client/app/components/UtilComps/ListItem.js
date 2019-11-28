import React from 'react';
import { Link } from 'react-router-dom';

const ListItem = props => {
    const { item, onSelect } = props
    let classname;
    if (item.isAdded) {
      classname = 'light-green';
    } else if (item.isSelected) {
      classname = 'light-grey'
    } else {
      classname = ''
    }
    return (
      <li
      className={classname}
      onClick={() => onSelect(item)}>
        <div className="row">
          {item.isAdded && (
            <div 
            className="cross-in-corner"
            onClick={e => props.onRemove([item])}>
              X
            </div>
          )}
          <div className="col">
            {item.images.map((url, i) => (
              <img
              key={i}
              className={`list-image-${i}`}
              src={url} alt={item.name}/>
            ))}
          </div>
          <div className="col item-data align-right">
            <p>{item.name}</p>
            <p className="small">{item.sku}</p>
            <p>${item.unitPriceUSD}</p>
            <Link
            to={`view/${item._id}`}
            className="btn btn-danger">Open</Link>
          </div>
        </div>
      </li>
    )
}

export default ListItem