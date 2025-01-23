import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    console.log("Authentication successful.");

    const fetchingMetafieldsResponse = await admin.graphql(
      `#graphql
      query {
        metafieldDefinitions(first: 250, ownerType: PRODUCT) {
          edges {
            node {
              key
            }
          }
        }
      }`
    );

    console.log("Fetched metafields:", fetchingMetafieldsResponse);

    const existingKeys = new Set(
      fetchingMetafieldsResponse.data.metafieldDefinitions.edges.map(
        (edge) => edge.node.key
      )
    );

    const metafieldsToCreate = [
      {
        name: "Enable Pay Your Price",
        namespace: "objects",
        key: "enable_pay_your_price",
        description: "Allows customers to propose a custom price for the product during add to cart process.",
        type: "boolean",
        pin: true,
        ownerType: "PRODUCT",
      },
      {
        name: "Minimum Price",
        namespace: "objects",
        key: "minimum_price_value",
        description: "Sets the minimum allowable price for the product, preventing sales below this threshold.",
        type: "number_decimal",
        pin: true,
        ownerType: "PRODUCT",
      },
      {
        name: "Suggested Price",
        namespace: "objects",
        key: "suggested_price_value",
        description: "Displays a recommended price for the product to guide customer purchases.",
        type: "number_decimal",
        pin: true,
        ownerType: "PRODUCT",
      }
    ];

    const createMetafieldPromises = metafieldsToCreate
      .filter((metafield) => !existingKeys.has(metafield.key))
      .map((metafield) =>
        admin.graphql(
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
        )
      );

    console.log("Creating metafields...");

    const results = await Promise.all(createMetafieldPromises);

    console.log("Metafields creation results:", results);
  } catch (error) {
    console.error("Error during metafield creation:", error);
  }

  return null;
};
