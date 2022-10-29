import React, { useState } from 'react';
import _ from 'lodash';
import '../CSS/Products.css';
import Search from './Search';
import Batch from './Batch';
function Products(props) {
  const [searchWord, setSearchWord] = useState('');
  const [selectedBatch, setSelectedBatch] = useState();
  const searchHandler = (searchQuery) => {
    setSearchWord(searchQuery);
  };
  let filteredArr = props.products.filter((item) => {
    // console.log(date() + ' ' + newDate.toLocaleString());
    return item.name.toLowerCase().includes(searchWord);
  });
  const dropDownHandler = (event) => {
    const selectedInputBatch = event.target.value;
    setSelectedBatch(selectedInputBatch);
  };
  const filteredArrByBatch = _(
    props.ungroupedData.filter((item) => {
      return item.batch == selectedBatch;
    })
  )
    .groupBy('batch')
    .map((objs, key) => {
      const numerator = _.minBy(objs, 'free').free;
      let denominator = _.maxBy(objs, 'deal').deal;
      denominator = denominator === 0 ? 1 : denominator;
      const ratio = numerator / denominator;
      return {
        name: _.uniqBy(objs, 'name')[0].name,
        stock: _.sumBy(objs, 'stock'),
        mrp: _.maxBy(objs, 'mrp').mrp,
        rate: _.maxBy(objs, 'rate').rate,
        exp: _.minBy(objs, 'exp').exp,
        batch: key,
        free: ratio,
        deal: ratio,
      };
    })
    .value();
  return (
    <React.Fragment>
      <div>{<Search onSearch={searchHandler} />}</div>
      {filteredArr.length === 0 && searchWord.length > 0 && (
        <p>No Products Found!</p>
      )}
      {filteredArr.length > 0 && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr className="fixed-head">
                <th>Name</th>
                <th>Batch</th>
                <th>Stock</th>
                <th>Deal</th>
                <th>Free</th>
                <th>MRP</th>
                <th>Rate</th>
                <th>EXP</th>
              </tr>
            </thead>
            <tbody>
              {selectedBatch !== 'All' && selectedBatch && (
                <Batch
                  key={filteredArrByBatch[0].name}
                  name={filteredArrByBatch[0].name}
                  batch={filteredArrByBatch[0].batch}
                  stock={filteredArrByBatch[0].stock}
                  deal={filteredArrByBatch[0].deal}
                  free={filteredArrByBatch[0].free}
                  mrp={filteredArrByBatch[0].mrp}
                  rate={filteredArrByBatch[0].rate}
                  exp={filteredArrByBatch[0].exp}
                />
              )}
              {filteredArr.map((d, index) => (
                <tr key={index}>
                  <td>{d.name}</td>
                  <td>
                    <select onChange={dropDownHandler}>
                      <option>All</option>
                      {[...new Set(d.batch.map(({ batch }) => batch))].map(
                        (batchItem, batchIndex) => {
                          return <option key={batchIndex}>{batchItem}</option>;
                        }
                      )}
                    </select>
                  </td>

                  <td>{d.stock}</td>
                  <td>{d.deal}</td>
                  <td>{d.free}</td>
                  <td>{d.mrp}</td>
                  <td>{d.rate}</td>
                  <td>
                    {d.exp.getDate() +
                      '/' +
                      (d.exp.getMonth() + 1) +
                      '/' +
                      d.exp.getFullYear()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </React.Fragment>
  );
}
export default Products;
