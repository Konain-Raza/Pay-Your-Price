import { authenticate } from "../shopify.server";
import { Page, Layout, Text, Card, BlockStack, Button, Banner, CalloutCard, Box, VideoThumbnail, MediaCard, InlineGrid, Link, InlineStack, Grid, Icon } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import feature1 from "../assets/images/custom_price_input.svg"
import feature2 from "../assets/images/minimum_and_maximum_acceptable_price.svg"
import feature3 from "../assets/images/variant_select.svg"
import feature4 from "../assets/images/set_predefined_pricing_options.svg"
import supportIcon from "../assets/images/app_support_icon (2).svg"
import {Modal, TitleBar, useAppBridge} from '@shopify/app-bridge-react';


export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
    query {
      shop {
        shopOwnerName
      }
    }`
  );
  const data = await response.json();
  return { shopOwnerName: data?.data?.shop?.shopOwnerName };
};

export default function OfferPriceApp() {
  const { shopOwnerName } = useLoaderData(); 
  const [isBannerVisible, setBannerVisible] = useState(true);
  const [isCalloutVisible, setCalloutVisible] = useState(true);

  const features = [
    { title: "Feature 1", description: "Description for Feature 1", image:feature1 },
    { title: "Feature 2", description: "Description for Feature 2" ,image:feature2 },
    { title: "Feature 3", description: "Description for Feature 3" ,image:feature3 },
    { title: "Feature 4", description: "Description for Feature 3" ,image:feature4 },

  ];

  return (
    <Page>
      <Layout>
        <Layout.Section>
        <Box paddingBlockEnd="400">
        <InlineStack gap="400" align="space-between" blockAlign="center">
          <Box>
          <Text variant="headingLg" as="h1">Welcome {shopOwnerName}</Text>
            <InlineStack gap="100">

             <Text>Welcome to Offer Your Price handcrafted by </Text>
          <Link url="https://help.shopify.com/manual">fulfilling orders</Link>
              </InlineStack>
          </Box>
            <Box><Button variant="primary">Need Help?</Button></Box>
         </InlineStack>

        </Box>
          {isBannerVisible && (
            <Banner
              title="USPS has updated their rates"
              action={{ content: "Update rates", url: "" }}
              secondaryAction={{ content: "Learn more" }}
              tone="info"
              onDismiss={() => setBannerVisible(false)}
            >
              <p>Make sure you know how these changes affect your store.</p>
            </Banner>
          )}

          <Box paddingBlock="400" width="586px">
            <Text variant="headingLg" as="h1">Setup Instructions</Text>
          </Box>

          <Card roundedAbove="sm">
            <Box>
              <BlockStack gap="200">
                <Text as="h3" variant="headingSm" fontWeight="medium">Reports</Text>
                <Text as="p" variant="bodyMd">View a summary of your online store’s performance.</Text>
              </BlockStack>
            </Box>
            <Box paddingBlockStart="200">
              <BlockStack gap="200">
                <Text as="h3" variant="headingSm" fontWeight="medium">Summary</Text>
                <Text as="p" variant="bodyMd">View a summary of your online store’s performance, including sales, visitors, top products, and referrals.</Text>
              </BlockStack>
            </Box>
          </Card>

          <Box paddingBlockStart="400">
            <Text variant="headingLg" as="h1">Features</Text>
          </Box>

          <InlineGrid gap="400" columns={{ xs: 1, sm: 2, md: 2 }} alignItems="end">
            {features.map((feature, index) => (
              <MediaCard key={index} portrait title={feature.title} description={feature.description}>
                <VideoThumbnail
                  thumbnailUrl={feature.image}
                  onClick={() => shopify.modal.show('my-modal')}
                />
              </MediaCard>
            ))}
          </InlineGrid>

          <Box paddingBlock="400" width="586px">
            <Text variant="headingLg" as="h1">Support</Text>
          </Box>

            <CalloutCard
              title="Customize the style of your checkout"
              illustration={supportIcon}
              primaryAction={{ content: "Customize checkout", onClick: () => console.log("clicked") }}
              secondaryAction={{ content: "Customize checkout" }}
            >
              <p>Upload your store’s logo, change colors and fonts, and more.</p>
            </CalloutCard>

          <Box paddingBlock="400" width="586px">
            <Text variant="headingLg" as="h1">Recommended Apps</Text>
          </Box>

          <InlineGrid columns={3}>
            <Card roundedAbove="sm">
              <InlineStack gap="400" align="start" direction="row">
                <Box width="30%" roundedAbove="sm" display="flex" alignItems="center" justifyContent="center">
  <Icon source={supportIcon} tone="base" />
</Box>

                <BlockStack gap="100">
                  <Text as="h3" variant="headingSm" fontWeight="medium">Card Title</Text>
                  <Text as="p" variant="bodySm">This is a small description.</Text>
                  <Box paddingBlock="200"><Button>Install App</Button></Box>
                </BlockStack>
              </InlineStack>
            </Card>
          
          </InlineGrid>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
