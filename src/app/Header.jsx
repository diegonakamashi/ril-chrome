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
          placeholder='Search'
          className='search-input'
          onKeyUp={this._handleKeyUp}
          size='25'>
          </input>
        <div className='header-btn-container'>
          <span className="header-btn" title="Add" onClick={this._handleAdd}>
            <img className='add-button' src="../images/plus.svg" alt="" />
          </span>
          <span className="header-btn" title="Sync" onClick={this._handleSync}>
            <img src="../images/refresh.svg" alt="" />
          </span>
          <span className='header-btn' title="Settings" onClick={this._handleSettings}>
            <img src="../images/settings.svg" alt="" />
          </span>
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
