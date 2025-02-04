//for development
const EMPTY_UPDATE = {
  operations: [],
};

export function run(input) {
  const cartLines = input.cart.lines;

  const operations = cartLines.map((line) => {
    console.log(`Processing line: ${JSON.stringify(line)}`);

    const qty = line.quantity;
    console.log(`Line ID: ${line.id}, Final Qty: ${qty}`);

    const isValid = line?.__isValid?.value === "true"; 

    if (!isValid) {
      console.log(`Skipping line with ID ${line.id} due to invalid status.`);
      return null;
    }

    const currentPricePerUnit = parseFloat(line.cost.amountPerQuantity.amount);
    const customPricePerUnit = parseFloat(line.__custom_price?.value || 0);

    if (isNaN(customPricePerUnit) || customPricePerUnit <= 0) {
      console.log(`Invalid custom price for Line ID: ${line.id}`);
      return null;
    }

    console.log(`Line ID: ${line.id}, Current Price Per Unit: ${currentPricePerUnit}, Custom Price Per Unit: ${customPricePerUnit}`);

    return {
      update: {
        cartLineId: line.id,
        price: {
          adjustment: {
            fixedPricePerUnit: {
              amount: customPricePerUnit,
            },
          },
        },
      },
    };
  }).filter(Boolean); // Remove null values for lines without an update.

  if (!operations.length) {
    console.log("No price updates to apply.");
    return EMPTY_UPDATE;
  }

  return {
    operations: operations,
  };
}


//for production
// const EMPTY_UPDATE = { operations: [] };

// export function run(input) {
//   const operations = [];

//   for (const line of input.cart.lines) {
//     if (line?.__isValid?.value !== "true") continue;  // Skip invalid lines

//     const customPricePerUnit = parseFloat(line.__custom_price?.value || 0);
//     if (isNaN(customPricePerUnit) || customPricePerUnit <= 0) continue; // Skip invalid price

//     operations.push({
//       update: {
//         cartLineId: line.id,
//         price: {
//           adjustment: {
//             fixedPricePerUnit: { amount: customPricePerUnit },
//           },
//         },
//       },
//     });
//   }

//   return operations.length ? { operations } : EMPTY_UPDATE;
// }
