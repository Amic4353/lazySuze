function tesseract(image) {
  const { TesseractWorker } = require('tesseract.js');
  const worker = new TesseractWorker();

  let receiptProps = {};

  //helper functions
  const filterToItem = receiptArr => {
    return receiptArr.filter(line => {
      const firstCharNum = Number(line[0]);
      const lastCharNum = Number(line[line.length - 1]);
      if (!isNaN(firstCharNum) && !isNaN(lastCharNum) && !line.includes('=')) {
        return line;
      }
    });
  };

  const findTotal = receiptArr => {
    return Number(
      receiptArr
        .filter(line => {
          if (line.includes('TOTAL')) {
            return line;
          }
        })[0]
        .split(' ')[1]
    ).toFixed(2);
  };

  const findTaxTotal = (receiptArr, total) => {
    const subTotal = Number(
      receiptArr
        .filter(line => {
          if (line.includes('Sub-')) {
            return line;
          }
        })[0]
        .split(' ')[1]
    );
    return (total - subTotal).toFixed(2);
  };

  const itemsObjCreate = arrOfItems => {
    let itemObj = {};
    arrOfItems.forEach(line => {
      let i = 0;
      while (line[i] !== ' ') {
        i++;
      }
      let j = line.length - 1;
      while (line[j] !== ' ') {
        j--;
      }
      let quantity = line.slice(0, i);
      let price = line.slice(j + 1);
      let item = line.slice(i + 1, j);
      itemObj[item] = { quantity, price };
    });
    return itemObj;
  };
  //

  //tesseract worker
  worker
    .recognize(image)
    .progress(progress => {
      console.log('progress', progress);
    })
    .then(result => {
      const finishedtext = result.text.split('\n');
      console.log('finishedText:', finishedtext);
      const justItems = filterToItem(finishedtext);
      console.log('filter test:', justItems);
      const total = findTotal(finishedtext);
      console.log('total', total);
      const tax = findTaxTotal(finishedtext, total);
      console.log('tax', tax);
      const itemObject = itemsObjCreate(justItems);
      console.log('itemObj', itemObject);
      receiptProps = {
        itemLines: justItems,
        itemObject: itemObject,
        tax: tax,
        total: total,
      };
      console.log('complete');
      return receiptProps;
    });
}
