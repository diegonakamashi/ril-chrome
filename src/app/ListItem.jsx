import { h, Component } from 'preact';

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }

  _itemUrl() {
    const { item } = this.props
    if (item.resolved_url) {
      return item.resolved_url;
    }
    return item.given_url;
  }

  _faviconUrl() {
    var url = this._itemUrl();
    return "http://www.google.com/s2/favicons?domain_url=" + encodeURIComponent(url);
  }


  _itemTitle() {
    const { item } = this.props
    var title = '';
    if (item.resolved_title)
      title = item.resolved_title;
    else if (item.given_title)
      title = item.given_title;
    else
      title = this._itemUrl();

    return title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  _renderLoading = () => {
    return (
      <span></span>
    )
  }

  _handleMarkAsRead = () => {
    this.setState({ loading: true })
    this.props.handleMarkAsRead()
  }

  _handleClick = (ev) => {
    if (this.props.settings.autoMarkItemAsRead) {
      this.props.handleMarkAsRead()
    }
  }

  _renderItemLink = () => {
    const title = this._itemTitle()
    const className = this.state.loading ? 'item-link-loading' : 'item-link';
    return (
          <span>
            <a
              href={this._itemUrl()}
              className={className}
              onClick={this._handleClick}
              target="_blank"
              title={title}>{title}</a>
          </span>
    )
  }

  _renderButton = () => {
    if (this.state.loading) {
      return this._renderLoading()
    }

    return (
      <span
        className="mark-as-read-btn"
        title="Mark as Read "
        onClick={this._handleMarkAsRead}>
        ✓
      </span>
    )
  }

  render() {
    return (
      <tr className='item-tr'>
        <td className='favicon item-tr-favicon'>
          <span>
            <img src={this._faviconUrl()} className="favicon_img" />
          </span>
        </td>
        <td nowrap='nowrap' className='item-tr-title'>
          {this._renderItemLink()}
        </td>
        <td>
          {this._renderButton()}
        </td>
      </tr>
    )
  }
}

export default ListItem;
