import { authenticate } from "../shopify.server";
import { createMetafields } from "../services/registerMetafields.js";
import {registerCartTransform} from "../services/registerCloudFunctions.js"

import { Page, Layout, Text, Card, BlockStack } from "@shopify/polaris";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  await createMetafields(admin);
  await registerCartTransform(admin);
  return null;
};

export default function OfferPriceApp() {
  return (
    <Page title="Offer Your Price">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text as="h1" variant="headingXl" alignment="center">
                Welcome to Offer Your Price
              </Text>
              <Text as="p" variant="bodyMd" alignment="center">
                Set your own price and negotiate the best deals!
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
