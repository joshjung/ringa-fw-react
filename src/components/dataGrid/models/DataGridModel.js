import {Model} from 'ringa';

import {ArrayCollection} from 'ringa-fw-core';

import TrieSearch from 'trie-search';

import DataGridDimension from './DataGridDimension';
import DataGridDimensionRow from './DataGridDimensionRow';
import DataGridDimensionColumn from './DataGridDimensionColumn';
import DataGridDescriptorColumn from './DataGridDescriptorColumn';
import DataGridNodeContext from './DataGridNodeContext';

export default class DataGridModel extends Model {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(name, values) {
    super(name, values);

    this.addProperty('rootDimension', undefined, {
      type: DataGridDimension
    });

    this.addProperty('items', undefined, {
      type: ArrayCollection,
      onChange: () => this.items_changedHandler
    });

    this.addProperty('autoIndex', true);

    this.rebuildRootNodeContext();
    // if (this.autoIndex && this.items) {
    //   this.index();
    // }
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get rootNodeContext() {
    return this._rootNodeContext;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  index() {
    this.trieSearch = new TrieSearch();

    this.depthFirst(ref => {
      ref.context.dimension.indexItem(this.trieSearch, ref);
    });
  }

  search(value) {
    this.searchText = value;

    // this.rootDimension.forEach(dimension => {
    //   dimension.clearSearchResults();
    // });

    // this.trieSearch.get(this.searchText).forEach(ref => {
    //   ref.dimension.addSearchResult(ref);
    // });

    this.notify('change');
  }

  rebuildRootNodeContext() {
    // This will recursively build out the entire tree
    this._rootNodeContext = new DataGridNodeContext(this.rootDimension, this);

    this.notify('change');
  }

  depthFirst(callback) {
    this.rootNodeContext.depthFirst(callback);
  }

  getNodeByPath(path) {
    let node = this.items.items;

    try {
      while (path.length) {
        node = node[path.shift()];
      }
    } catch (error) {
      console.error(`DataGridModel: could not find object via path ${path.join(',')}`);

      return undefined;
    }

    return node;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  items_changedHandler() {
    this.autoIndex ? this.index() : undefined;

    this.rebuildRootNodeContext();
  }

  //-----------------------------------
  // Statics
  //-----------------------------------
  static constructDefaultRowColumnModel(columns, data) {
    let finalItems;

    if (data) {
      if (data instanceof ArrayCollection) {
        finalItems = data;
      } else {
        finalItems = new ArrayCollection({data});
      }
    }

    return new DataGridModel({
      rootDimension: new DataGridDimensionRow({
        dimension: new DataGridDimensionColumn({
          columns: columns.map(column => new DataGridDescriptorColumn(column))
        })
      }),
      items: finalItems
    });
  }
}