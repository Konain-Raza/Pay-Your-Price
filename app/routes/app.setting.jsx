import { Layout, Page, Card, List, TextContainer } from "@shopify/polaris";
import React from "react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    // Fetching existing metafields
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

    const existingKeys = new Set(
      fetchingMetafieldsResponse.data?.metafieldDefinitions?.edges?.map(
        (edge) => edge.node.key
      ) || []
    );

    const metafieldsToCreate = [
      {
        name: "Enable Pay Your Price",
        namespace: "objects",
        key: "01_enable_pay_your_price",
        description: "Allows customers to propose a custom price for the product during add to cart process.",
        type: "boolean",
        pin: true,
        ownerType: "PRODUCT"
    },
    {
        name: "Minimum Price",
        namespace: "objects",
        key: "01_minimum_price_value",
        description: "Sets the minimum allowable price for the product, preventing sales below this threshold.",
        type: "number_decimal",
        pin: true,
        ownerType: "PRODUCT"
    },
    {
        name: "Suggested Price",
        namespace: "objects",
        key: "03_suggested_price_value",
        description: "Displays a recommended price for the product to guide customer purchases.",
        type: "number_decimal",
        pin: true,
        ownerType: "PRODUCT"
    },
    {
        name: "Enable Price Options",
        namespace: "objects",
        key: "04_enable_price_options_product",
        description: "Enable or disable predefined price options for the product.",
        type: "boolean",
        pin: true,
        ownerType: "PRODUCT"
    },
    {
        name: "Price Options",
        namespace: "objects",
        key: "05_price_options",
        description: "Allows multiple predefined price options for the product.",
        type: "list.number_decimal",
        pin: true,
        ownerType: "PRODUCT"
    },
    {
        name: "Enable Pay Your Price",
        namespace: "objects",
        key: "enable_pay_your_price",
        description: "Allows customers to propose a custom price for the product during add to cart process.",
        type: "boolean",
        pin: true,
        ownerType: "PRODUCTVARIANT"
    },
    {
        name: "Minimum Price",
        namespace: "objects",
        key: "minimum_price_value",
        description: "Sets the minimum allowable price for the product, preventing sales below this threshold.",
        type: "number_decimal",
        pin: true,
        ownerType: "PRODUCTVARIANT"
    },
    {
        name: "Suggested Price",
        namespace: "objects",
        key: "suggested_price_value",
        description: "Displays a recommended price for the product to guide customer purchases.",
        type: "number_decimal",
        pin: true,
        ownerType: "PRODUCTVARIANT"
    },
    {
        name: "Enable Price Options",
        namespace: "objects",
        key: "enable_price_options_variant",
        description: "Enable or disable predefined price options for the variant.",
        type: "boolean",
        pin: true,
        ownerType: "PRODUCTVARIANT"
    },
    {
        name: "Price Options",
        namespace: "objects",
        key: "price_options",
        description: "Allows multiple predefined price options for the variant.",
        type: "list.number_decimal",
        pin: true,
        ownerType: "PRODUCTVARIANT"
    }
    
    ];

    // Creating metafields if not already present
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

    // Return creation results for frontend
    return { results };
  } catch (error) {
    console.error("Error during metafield creation:", error);
    return { data: null, error: error.message };
  }
};

const Setting = () => {
  const { results, error } = useLoaderData() || {};

  if (!results && !error) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Card>
              <TextContainer>
                <p>Error fetching data</p>
              </TextContainer>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card title="Metafield Definitions">
            {error ? (
              <TextContainer>
                <p>Error: {error}</p>
              </TextContainer>
            ) : (
              <List type="bullet" gap="loose">
                {results.map((result, index) => {
                  const userErrors = result.data?.metafieldDefinitionCreate?.userErrors;
                  if (userErrors && userErrors.length > 0) {
                    return (
                      <List.Item key={index}>
                        Error creating metafield: {userErrors[0].message}
                      </List.Item>
                    );
                  }
                  return (
                    <List.Item key={index}>
                      Metafield created successfully with ID: {result.data?.metafieldDefinitionCreate?.createdDefinition?.id}
                    </List.Item>
                  );
                })}
              </List>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Setting;
