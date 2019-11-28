import React, { Component } from 'react';

import Prompt from '../../UtilComps/Prompt';
import Loading from '../../App/Loading';

import { Link } from 'react-router-dom';

import { getItems } from '../../../utils/ItemAPI';
import { getCollections, deleteCollectionByID } from '../../../utils/CollectionAPI';

class ManageCollections extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collections: [],
      msg: '',
      toBeRemoved: '',
      isPrompt: false,
      isLoading: true
    }
    this.onDelete = this.onDelete.bind(this);
    this.onOpenPanel = this.onOpenPanel.bind(this);
    this.onClosePanel = this.onClosePanel.bind(this);
  }

  componentDidMount() {
    // get collections
    getCollections().then(json => {
      if (json.success) {
        const collections = json.collections;
        // get items
        getItems().then(json => {
          if (json.success) {
            const items = json.items;
            // filter items on correct collection, so it will add an array of items to the corresponding collection that has the same name
            // our finalized collection array will be stored in here
            const collectionsArr = [];
            // loop over collections to fetch the collection name
            collections.forEach(collection => {
              const collectionName = collection.name;
              // array of items for specific collection will be stored here
              const itemsArr = [];
              items.forEach(item => {
                // loop over items to get each array of collections from item
                const collectionsOfItem = item.collectionNames;
                console.log(collectionsOfItem);
                collectionsOfItem.forEach(coll => {
                  if (coll === collectionName) {
                    itemsArr.push(item);
                  }
                });
              });
              // set items as prop to collection
              collection.items = itemsArr;
              // push our collection to the full arary
              collectionsArr.push(collection);
            });
            this.setState({
              collections: collectionsArr,
              isLoading: false
            });
          } else {
            this.setState({
              msg: json.message,
              isLoading: false
            });
          }
        });
      } else {
        this.setState({
          msg: json.message,
          isLoading: false
        });
      }
    });
  }

  onDelete(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    // 2 actions: 1: delete collection, 2: delete collection name from items with that collection name (ALL DONE IN BACKEND)
    const { toBeRemoved } = this.state;
    deleteCollectionByID(toBeRemoved)
    .then(json => {
      if (json.success) {
        this.setState(prevState => ({
          collections: prevState.collections.filter(collection => collection._id !== toBeRemoved),
          msg: json.message,
          isPrompt: false,
          isLoading: false
        }));
      } else {
        this.setState({
          msg: json.message,
          isPrompt: false,
          isLoading: false
        });
      }
    });
  }

  onOpenPanel(e, id) {
    e.preventDefault();

    // set in state the id to be removed, because the prompt won't know it
    this.setState({
      isPrompt: true,
      toBeRemoved: id
    });
  }

  onClosePanel(e) {
    e.preventDefault();

    if (e.target.classList.value === 'prompt-container' || e.target.classList.value === 'btn btn-danger back-btn') {
      this.setState({
        isPrompt: false,
        toBeRemoved: null
      });
    }
  }

  render() {
    const { collections, msg, isPrompt, isLoading } = this.state;

    return (
      <>

        {isLoading && (
          <Loading/>
        )}

        {isPrompt && (
          <Prompt
          text={'Are you sure?'}
          onBack={this.onClosePanel}
          onConfirm={this.onDelete}
          />
        )}

        <h2>Manage collections</h2>

        {msg && (
          <p className="alert alert-success">{msg}</p>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Items in collection</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {collections.map(collection => (
              <tr key={collection._id}>
                <td>{collection.name}</td>
                <td>{collection.items.map((item, i) => (
                  <>{i <= 2 && i < collection.items.length - 1 ? (
                    <>{item.name}, </>
                  ):(
                    <>{i == 3 || i == collection.items.length - 1 ? (
                      <>{item.name}.</>
                    ):(
                      <>{i == 4 && (
                        <>...</>
                      )}
                        </>
                    )}</>
                  )}</>
                ))}</td>
                <td>
                  <button 
                  className="btn btn-danger"
                  onClick={e => this.onOpenPanel(e, collection._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <Link to='/create-collection' className="btn btn-primary">Add collection</Link>

      </>
    )
  }
}

export default ManageCollections;