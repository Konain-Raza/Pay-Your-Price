import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.All,
  discounts: [],
};

export function run(input) {
  const cartLines = input.cart.lines;

  const discounts = cartLines.map((line) => {
    console.log(`Processing line: ${JSON.stringify(line)}`);

    const qtyMetafield = line?.__qty?.value;
    const qty = line.quantity;

    console.log(`Line ID: ${line.id}, __qty Metafield: ${qtyMetafield}, Final Qty: ${qty}`);

    const isValid = line?.__isValid?.value === "true"; 

    if (!isValid) {
      console.log(`Skipping line with ID ${line.id} due to invalid status.`);
      return null;
    }

    const pricePerUnit = parseFloat(line.cost.amountPerQuantity.amount);
    const customPricePerUnit = parseFloat(line.__custom_price?.value || 0);
    const discountPerUnit = pricePerUnit - customPricePerUnit;
    const totalDiscountAmount = discountPerUnit * qty;

    console.log(`Line ID: ${line.id}, Price Per Unit: ${pricePerUnit}, Custom Price Per Unit: ${customPricePerUnit}, Discount Per Unit: ${discountPerUnit}, Total Discount Amount: ${totalDiscountAmount}`);

    if (totalDiscountAmount > 0) {
      console.log(`Applying discount: ${totalDiscountAmount} for Line ID: ${line.id}`);
      return {
        targets: [{ cartLine: { id: line.id } }],
        value: {
          fixedAmount: {
            amount: totalDiscountAmount,
          },
        },
      };
    } else {
      console.log(`No discount applied for Line ID: ${line.id}`);
    }

    return null;
  }).filter(Boolean); // Remove null values for lines without a discount.

  if (!discounts.length) {
    console.log("No discounts to apply.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: discounts,
    discountApplicationStrategy: DiscountApplicationStrategy.All,
  };
}
