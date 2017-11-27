import React from 'react';

import DataGridComponentBase from './DataGridComponentBase';
import TextInput from '../../input/TextInput';
import DataGridDimensionRow from "../models/DataGridDimensionRow";
import DataGridDimensionColumn from "../models/DataGridDimensionColumn";

export default class DataGridHeader extends DataGridComponentBase {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    const {nodeContext} = this.props;

    let cn = this.calcClassnames('data-grid-header');

    // At this point, in order to be a header for data, we have to *assume* that our NodeContext is a DataGridDimensionRow,
    // since there really isn't much of a point in having a header for data this *isnt* in a row collection

    // We pass in undefined since the DataGridDimensionRow always returns the nextDimension...
    let columnDimension = nodeContext.dimension.getNextDimensionFor();

    if (!(columnDimension instanceof DataGridDimensionColumn)) {
      throw new Error('DataGridHeader: you are trying to display a header for a dimension which is not a column dimension!', nodeContext);
    }

    let headerCells = columnDimension.columns.map(column => {
      let HeaderCellRenderer = column.headerCellRenderer;

      return <HeaderCellRenderer key={column.id} column={column} />;
    });

    return <div className={cn}>
      {columnDimension.headerSettings.showFunctions ? this.renderFunctions() : undefined}
      <div className="cells horizontal">
        {headerCells}
      </div>
    </div>;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  renderFunctions() {
    const {nodeContext} = this.props;
    const {i18NModel} = this.state;

    return <div className="functions">
      <div className="title"></div>
      <div className="search">
        <TextInput placeholder={i18NModel.i18n('list.search')}
                   onChange={this.search_onChangeHandler}/>
      </div>
    </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  search_onChangeHandler(event, value) {
    const {context} = this.props;

    context.dataGridModel.search(value);
  }
}
