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
    const qty = line.quantity;
    console.log(qty)
    const pricePerUnit = parseFloat(line.cost.amountPerQuantity.amount);
    const customPricePerUnit = parseFloat(line.__custom_price?.value * qty || 0);
    const discountPerUnit = pricePerUnit - customPricePerUnit;
    const totalDiscountAmount = discountPerUnit * qty;

    if (totalDiscountAmount > 0) {
      return {
        targets: [{ cartLine: { id: line.id } }],
        value: {
          fixedAmount: {
            amount: totalDiscountAmount,
          },
        },
      };
    }
    return null;
  }).filter(Boolean); // Remove null values for lines without a discount.

  if (!discounts.length) {
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: discounts,
    discountApplicationStrategy: DiscountApplicationStrategy.All,
  };
}
