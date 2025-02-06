export const createMetafields = async (admin) => {
  const metafieldsToCreate = [
    {
      name: "Enable Offer Your Price",
      namespace: "objects",
      key: "enable_offer_your_price",
      description: "Enables customers to propose their custom price during the checkout process for this product variant.",
      type: "boolean",
      pin: true,
      ownerType: "PRODUCTVARIANT",
    },
    {
      name: "Minimum Acceptable Price",
      namespace: "objects",
      key: "minimum_acceptable_price",
      description: "Defines the minimum price that can be proposed for this variant to ensure acceptable profitability.",
      type: "number_decimal",
      pin: true,
      ownerType: "PRODUCTVARIANT",
    },
    {
      name: "Maximum Acceptable Price",
      namespace: "objects",
      key: "maximum_acceptable_price",
      description: "Defines the maximum price that a customer can propose for this variant to ensure it remains within acceptable limits.",
      type: "number_decimal",
      pin: true,
      ownerType: "PRODUCTVARIANT",
    },
    {
      name: "Suggested Price",
      namespace: "objects",
      key: "suggested_price",
      description: "Displays the suggested retail price for the product to guide customer offers and purchases.",
      type: "number_decimal",
      pin: true,
      ownerType: "PRODUCTVARIANT",
    },
    {
      name: "Enable Price Options",
      namespace: "objects",
      key: "enable_price_options",
      description: "Allows the use of predefined price options for this variant, offering flexibility in pricing.",
      type: "boolean",
      pin: true,
      ownerType: "PRODUCTVARIANT",
    },
    {
      name: "Predefined Price Options",
      namespace: "objects",
      key: "predefined_price_option",
      description: "Allows multiple predefined price options for customers to select from when purchasing this variant.",
      type: "list.number_decimal",
      pin: true,
      ownerType: "PRODUCTVARIANT",
    }
  ];

  const results = [];
  for (let metafield of metafieldsToCreate.reverse()) {
    console.log(`Creating metafield: ${metafield.name} with key ${metafield.key}`);
    try {
      const response = await admin.graphql(
        `#graphql
        mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
          metafieldDefinitionCreate(definition: $definition) {
            createdDefinition {
              id
            }
            userErrors {
              message
            }
          }
        }`,
        { variables: { definition: metafield } }
      );
      console.log('Metafield created:', response);
      results.push(response);
    } catch (error) {
      console.error('Error creating metafield:', error);
    }
  }

  return results;
};
