import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { getItems } from '../../../utils/ItemAPI';

class ManageItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      msg: ''
    }
  }

  componentDidMount() {
    getItems()
    .then(json => {
      if (json.success) {
        this.setState({
          items: json.items
        });
      } else {
        this.setState({
          msg: json.message
        })
      }
    });
  }

  render() {
    const { items, msg } = this.state;
    return (
      <> 
        {msg && (
          <p className="alert alert-danger">{msg}</p>
        )}
        <h2>Manage items</h2>
        <table className="table">
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                <td>
                  {item.images.map((url, i) => (
                    <img key={i} src={url} alt={'image ' + i}/>
                  ))}
                </td>
                <td>{item.name}</td>
                <td>${item.unitPriceUSD}</td>
                <td><Link
                to={`item/${item._id}`}
                className="btn btn-info">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to='/add-item' className="btn btn-primary">Add Item</Link>
      </>
    )
  }
}

export default ManageItems;