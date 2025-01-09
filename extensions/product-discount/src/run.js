import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export function run(input) {
  console.log("Cart Line Data:", JSON.stringify(input.cart.lines));

  const targets = input.cart.lines
    .filter((line) => line.quantity >= 1)
    .map((line) => {
      const lineId = line.id;
      const qty = line.quantity
      const price = parseFloat(line.cost.amountPerQuantity.amount);
      const customPrice = parseFloat(line.custom_price.value || 0);
      const discountAmount = (price - customPrice );
    



      console.log(`Line ID: ${lineId}, Original Price: ${price}, Custom Price: ${customPrice}, Discount: ${discountAmount}`);

      return {
        cartLine: {
          id: lineId,
        },
        discountAmount: discountAmount, 
        qty:qty// Store the discount amount
      };
    });

  if (!targets.length) {
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: targets.map((target) => ({
      targets: [{ cartLine: target.cartLine }],
      value: {
        fixedAmount: {
          amount: target.discountAmount * target.qty,
        },
      },
    })),
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}

