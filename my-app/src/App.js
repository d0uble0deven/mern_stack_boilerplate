import React, { Component } from 'react';
import axios from 'axios';


class App extends Component {

  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  }

  // fetch existing data when component mounts
  // check if db has changed, implement changes
  componentDidMount() {
    this.getDataFromDb()
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000)
      this.setState({ intervalIsSet: interval })
    }
  }

  // kills process when user is finished
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet)
      this.setState({ intervalIsSet: null })
    }
  }

  // corresponds to get method on backend api, fetches data from DB
  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }))
  }

  // corresponds to put method on backend api, creates new query into our DB
  putDataToDB = (message) => {
    let currentIds = this.state.data.map((data) => data.id)
    let idToBeAdded = 0
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded
    }

    axios.post('http://localhost:3001/api/putData', {
      id: idToBeAdded,
      message: message
    })
  }

  // corresponds to delete method, removes query from DB
  deleteFromDB = (idToDelete) => {
    parseInt(idToDelete)
    let objIdToDelete = null
    this.state.data.forEach((item) => {
      if (item.id == idToDelete) {
        objIdToDelete = item._id
      }
    })

    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete,
      }
    })
  }

  // correspone to update method, overwrites existing DB
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null
    parseInt(idToUpdate)
    this.state.data.forEach((item) => {
      if (item.id == idToUpdate) {
        objIdToUpdate = item._id
      }
    })

    axios.post('http://localhost:3001/api/updateData', {
      id: objIdToUpdate,
      update: { message: updateToApply }
    })
  }


  // below is the UI
  render() {

    const { data } = this.state

    return (
      <div>
        <ul>
          {data.length <= 0
            ? 'NO DB ENTRIES YET'
            : data.map((dat) => (
              <li style={{ color: 'gray' }} key={data.message}>
                <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
                <span style={{ color: 'gray' }}> data: </span>
                {dat.message}
              </li>
            ))}
        </ul>

        {/* add */}
        <div style={{ padding: '10px' }}>
          <input
            type='text'
            onChange={(e) => this.setState({ message: e.target.value })}
            placeholder="add something in the database"
            style={{ width: '200px' }}
          />
          <button onClick={() => this.putDataToDB(this.state.message)}>
            ADD
          </button>
        </div>

        {/* delete */}
        <div style={{ padding: '10px' }}>
          <input
            type='text'
            onChange={(e) => this.setState({ idToDelete: e.target.value })}
            placeholder="put id of item to delete here"
          />
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>

        {/* update */}
        <div style={{ padding: '10px' }}>
          <input
            type='text'
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ idToUpdate: e.target.value })}
            placeholder="put id of item to update here"
          />
          <input
            type='text'
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ updateToApply: e.target.value })}
            placeholder="put new value of the item here"
          />
          <button
            onClick={() => this.updateDB(this.state.idToUpdate, this.state.updateToApply)}>
            UPDATE
          </button>
        </div>
      </div>
    );
  }
}

export default App;
