import { h, Component } from 'preact';
import ListItem from './ListItem'

class List extends Component {

  _handleMarkAsRead = (item) => {
    this.props.handleMarkItemAsRead(item)
  }

  _renderItems = () => {
    let index = 0;
    return this._sortItems().map((item) => {
      return this._renderItem(item, index++);
    });
  }

  _renderItem = (item, index) => {
    return (
      <ListItem
        key={item.item_id}
        item={item}
        settings={this.props.settings}
        handleMarkAsRead={() => this._handleMarkAsRead(item)}
      >
      </ListItem>
    )
  }

  _sortItems = () => {
    return this.props.items.sort((a, b) => {
      const isNew = this.props.settings.orderBy == 'new';
      const timeA = parseFloat(a.time_updated);
      const timeB = parseFloat(b.time_updated);
      if (timeA < timeB) {
        return isNew ? 1 : -1;
      }
      if (timeA > timeB) {
        return isNew ? -1 : 1;
      }
      return 0;
    })
  }

  render() {
    return (
      <div className="iwillril-table-container">
        <table id='iwillril_table' cellpadding="5" width='95%' >
          <tbody id="table_list">
            {this._sortItems().map(this._renderItem)}
          </tbody>
        </table>
      </div>
    )
  }
}

export default List;
