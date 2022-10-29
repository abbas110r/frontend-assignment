import React, { useState } from 'react';
import InputLoader from './Components/InputLoader';
import * as XLSX from 'xlsx';
import styles from './CSS/App.module.css';
import Products from './Components/Products';
import _ from 'lodash';
function App() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: 'buffer' });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setItems(d);
      setIsLoading(false);
    });
  };
  const fileUploadHandler = (file) => {
    setIsLoading(true);
    readExcel(file);
  };
  //
  let groupedArr = _(items)
    .groupBy('name')
    .map((objs, key) => {
      const filteredBatches = objs.filter((obj) => {
        return obj['name'] === key;
      });

      const numerator = _.minBy(objs, 'free').free;
      let denominator = _.maxBy(objs, 'deal').deal;
      denominator = denominator === 0 ? 1 : denominator;
      const ratio = numerator / denominator;

      return {
        name: key,
        stock: _.sumBy(objs, 'stock'),
        mrp: _.maxBy(objs, 'mrp').mrp,
        rate: _.maxBy(objs, 'rate').rate,
        exp: _.minBy(objs, 'exp').exp,
        batch: filteredBatches,
        free: ratio,
        deal: ratio,
      };
    })
    .value();
  function convert(excelDate) {
    const newDate = new Date((excelDate - 25567 - 2) * 86400 * 1000);
    return newDate;
  }
  for (let item of groupedArr) {
    item['exp'] = convert(item['exp']);
  }
  console.log(groupedArr);
  return (
    <div className={styles['container']}>
      {!items.length > 0 && <InputLoader onUpload={fileUploadHandler} />}
      {isLoading && !items.length > 0 && (
        <p className={styles['loader']}>Loading...</p>
      )}
      {items.length > 0 && (
        <Products products={groupedArr} ungroupedData={items} />
      )}
    </div>
  );
}
export default App;
