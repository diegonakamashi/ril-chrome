import { h, Component } from 'preact';

class Header extends Component {

  _handleAdd = () => {
    this.props.handleAddItem()
  }

  _handleSync = () => {
    this.props.handleSyncItems()
  }

  _handleOrderBy = (ev) => {
    this.props.handleChangeOrderBy(ev.target.value)
  }

  _handleKeyUp = (ev) => {
    const word = ev.target.value;
    this.props.handleSearch(word);
  }

  _handleSettings = (ev) => {
    ev.preventDefault();
    const optionsUri = chrome.extension.getURL('html/options.html');
    window.open(optionsUri)

  }

  render() {
    return (
      <header className='extension-header'>
        <input
          type='text'
          placeholder='Find'
          onKeyUp={this._handleKeyUp}
          size='25'>
          </input>
        <div>
          <span className="btn" title="Add" onClick={this._handleAdd}>Add</span>
          <span className="btn" title="Sync" onClick={this._handleSync}>Sync</span>
          <span className='btn' title="Settings" onClick={this._handleSettings}>Set</span>
          <select id="order_select" onChange={this._handleOrderBy} value={this.props.settings.orderBy}>
            <option value="old">Oldest</option>
            <option value="new">Newest</option>
          </select>
        </div>

      </header>
    )
  }
}

export default Header;
