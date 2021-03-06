import React from 'react';

import DataGridComponentBase from '../DataGridComponentBase';

export default class DataGridCellRenderer extends DataGridComponentBase {
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
    let {nodeContext} = this.props;
    let {data, column} = nodeContext;

    let label = column.toLabel(data, nodeContext);

    let cn = this.calcClassnames('data-grid-cell', column.itemCellClasses);
    let cccn = this.calcClassnames('data-grid-cell-label', column.itemCellLabelClasses);

    return <div className={cn} style={{width: column.width}}>
      <div className={cccn}>
        {label}
      </div>
    </div>;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  calcClassnames(...args) {
    let {nodeContext} = this.props;
    let {column} = nodeContext;

    let cn = column.itemCellClassesFunction ? column.itemCellClassesFunction(nodeContext) : column.itemCellClasses;

    args.push(cn);

    return super.calcClassnames.apply(this, args);
  }
}
