import { h, Component } from 'preact';
import Header from './Header.jsx'
import List from './List.jsx'

import {
  getSettings,
  updateSettings
} from './repo.js'

import events from './../events'
import { UNAUTHORIZED_ERROR } from '../errors.js';
import Auth from '../auth.js';

class App extends Component {
  constructor(props) {
    super(props);
    this._searchTimeout = null;
    this.state = {
      items: [],
      settings: {},
      error: false
    };
  }

  async componentDidMount() {
    const self = this;
    const settings = await getSettings()
    this.setState({ settings })
    const message = { msg: events.FETCH_ITEMS_FROM_CACHE }
    chrome.runtime.sendMessage(message, (response) => {
      if (response.success && response.payload && response.payload.length > 0) {
        self.setState({ items: response.payload })
      } else {
        self._handleSyncItems()
      }
    });
  }

  _handleAddTab = () => {
    const self = this
    chrome.tabs.getSelected(null, async function (tab) {
      const url = tab.url;
      const title = tab.title;

      const message = {
        msg: events.ADD,
        payload: {
          url, title
        }
      }
      chrome.runtime.sendMessage(message, (response) => {
        if (response.success) {
          self.setState({ items: response.payload })
        }
      });
    });
  }

  _handleSyncItems = () => {
    const self = this;
    const message = { msg: events.REFRESH_ITEMS }
    chrome.runtime.sendMessage(message, (response) => {
      if (response.success) {
        self.setState({ items: response.payload })
      } else {
        if (response.error === UNAUTHORIZED_ERROR) {
          Auth.authenticate()
        }
      }
    });
  }

  _handleMarkItemAsRead = (item) => {
    const self = this;
    const message = { msg: events.ARCHIVE, payload: { itemId: item.item_id } }
    chrome.runtime.sendMessage(message, (response) => {
      if (response.success) {
        self.setState({ items: response.payload })
      }
    });
  }

  _handleChangeOrderBy = async (orderBy) => {
    await updateSettings('orderBy', orderBy);
    const settings = await getSettings()
    this.setState({ settings })
  }

  _handleSearch = async (word) => {
    const self = this;
    clearTimeout(this._searchTimeout);

    this._searchTimeout = setTimeout(() => {
      const message = {
        msg: events.FETCH_ITEMS_FROM_CACHE,
        payload: { searchWord: word }
      }

      chrome.runtime.sendMessage(message, (response) => {
        if (response.success && response.payload) {
          self.setState({ items: response.payload })
        }
      });
    }, 100)
  }

  render() {
    return (
      <div id="page_body">
        <Header
          handleAddItem={this._handleAddTab}
          handleSearch={this._handleSearch}
          handleSyncItems={this._handleSyncItems}
          handleChangeOrderBy={this._handleChangeOrderBy}
          settings={this.state.settings}
        >
        </Header>
        <List
          items={this.state.items || []}
          settings={this.state.settings}
          handleMarkItemAsRead={this._handleMarkItemAsRead}
        ></List>
      </div>
    )
  }
}

export default App;
