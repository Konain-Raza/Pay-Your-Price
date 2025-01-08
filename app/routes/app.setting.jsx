import { Layout, Page, Card, List } from "@shopify/polaris";
import React from "react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(
      `mutation metafieldStorefrontVisibilityCreate($input: MetafieldStorefrontVisibilityInput!) {
        metafieldStorefrontVisibilityCreate(input: $input) {
          metafieldStorefrontVisibility {
            key
            namespace
            ownerType
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables:{
          input: {
            key: "min-price", // String
            namespace: "min-price", // String
            "ownerType": "API_PERMISSION"// String (double-check if the value is valid)
          }
        }
      }
    );

    const data = await response.json() || {};
    console.log(data);

    return { data };
  } catch (error) {
    console.error("Error in loader:", error.message);
    return { data: null, error: error.message }; // Explicitly returning an error response
  }
};




const Setting = () => {
  const { data } = useLoaderData() || {};
  console.log(data);
  if (!data) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Card>Error fetching data</Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card title="Metafield Definition">
            <List type="bullet" gap="loose">
              <List.Item>Metafield Name: Ingredients</List.Item>
              <List.Item>Namespace: bakery</List.Item>
              <List.Item>Key: ingredients</List.Item>
              <List.Item>
                Description: A list of ingredients used to make the product.
              </List.Item>
              <List.Item>Type: multi_line_text_field</List.Item>
            </List>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Setting;
