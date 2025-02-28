import { authenticate } from "../shopify.server";
import { Page, Layout, Text, Card, BlockStack, Button, Banner, CalloutCard, Box, VideoThumbnail, MediaCard, InlineGrid, Link, InlineStack, Grid, Icon, Thumbnail } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import feature1 from "../assets/images/custom_price_input.svg"
import feature2 from "../assets/images/minimum_and_maximum_acceptable_price.svg"
import feature3 from "../assets/images/set_predefined_pricing_options.svg"
import feature4 from "../assets/images/variant_select.svg"
import supportIcon from "../assets/images/app_support_icons.svg"
import wave from "../assets/images/Waving Hand.gif"
import { createMetafields } from "../services/registerMetafields";
import { registerCartTransform } from "../services/registerCloudFunctions";


export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  await createMetafields(admin);
  await registerCartTransform(admin);
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

  const features = [
    { title: "💰 Custom Price Input", description: "Unlock more sales by letting your customers decide what they’re willing to pay!", image: feature1 },
    { title: "📏 Minimum & Maximum Price", description: "Place pricing limits to manage how much customers can bid for your product.", image: feature2 },
    { title: "🎯 Predefined Pricing Options", description: "Pick from ready-made pricing plans for an effortless, lightning-fast selection.", image: feature3 },
    { title: "🔄 Variant Selection", description: "Allow customers to pay what they want, even for different product variants.", image: feature4 }
  ];
  
  const steps = [
    { title: "✅ Step 1:", description: "Go to Products and open any product." },
    { title: "✅ Step 2:", description: "Scroll down to Metafields and enable Offer Your Price." },
    { title: "✅ Step 3:", description: "Set your minimum and maximum price limits. You can also add suggested prices for your customers." },
    { title: "✅ Step 4:", description: "Want predefined pricing options? Enable them first, then customize them as needed." }
  ];
  

  return (
    <Page>
      <Layout>
        <Layout.Section>
        <Box paddingBlockEnd="400">
        <InlineStack gap="400" align="space-between" blockAlign="center">
          <Box>
          <Text variant="headingLg" as="h1">Hello, {shopOwnerName} 👋🏻
          </Text>
            <InlineStack gap="100">

             <Text>Welcome to Offer Your Price, crafted with ❤️ by 
             </Text>
          <Link target="_blank" url="https://apps.shopify.com/partners/objects7">Objects</Link>
              </InlineStack>
          </Box>
            <Box><Button variant="primary">Need Help?</Button></Box>
         </InlineStack>

        </Box>
            <Banner
            hideIcon
              title="📢 Must Read!"
            >
            <Text as="p" variant="bodyMd">
            To use <Text as="span" fontWeight="medium" display="inline">Offer Your Price</Text>, you need to enable it first. Navigate to:  
            <Text as="span" fontWeight="medium" display="inline"> Online Store &gt; Themes &gt; Customize &gt; App Embeds</Text> and switch it on.
            </Text>


            </Banner>

          <Box paddingBlock="400" width="586px">
            <Text variant="headingLg" as="h2">Setup Instructions ⚙️</Text>
          </Box>

          <Card roundedAbove="sm">
            {steps.map((step, index) => (
                <Box key={index} paddingBlockStart="200">
                <BlockStack gap="200">
                    <Text as="h3" variant="headingMd" >
                    {step.title}
                    </Text>
                    <Text as="p" variant="bodyMd">{step.description}</Text>
                </BlockStack>
                </Box>
            ))}
            </Card>

          <Box paddingBlockStart="400">
            <Text variant="headingLg" as="h2">Features 🔥</Text>
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
            <Text variant="headingLg" as="h1">Support 💡</Text>
          </Box>

            <CalloutCard
              title="Need help? Our support team is always there for you! 😊
"
              illustration={supportIcon}
              primaryAction={{ content: "Get Support", onClick: () => console.log("clicked") }}
              secondaryAction={{ content: "Email Us" }}
            >
              <p>📞 Contact us anytime for assistance with setup, troubleshooting, or customization.</p>
            </CalloutCard>

          <Box paddingBlock="400" width="586px">
            <Text variant="headingLg" as="h2">Recommended Apps</Text>
          </Box>
          <InlineGrid gap="400" columns={{ xs: 1, sm: 2, md: 2 }} alignItems="end">
          <Box paddingBlockEnd="300">
            <Card roundedAbove="sm">
                <InlineStack gap="400" align="start" blockAlign="center">
                <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                >
                    <Thumbnail 
                    source={"https://cdn.shopify.com/app-store/listing_images/9dc6029422e897e843e482e786a21c52/icon/CLDxraju1_oCEAE=.png"} 
                    alt="Black choker necklace" 
                    />
                </Box>

                <Box width="350px">
                    <Text as="h3" variant="headingSm" fontWeight="medium">Smart Variant Table</Text>
                    <Text as="p" variant="bodySm">Boost sales with customizable variants! Simplify bulk orders, flexible pricing & real-time stock tracking.</Text>
                    <Box paddingBlock="200">
                    <Button external target="_blank"  url="https://apps.shopify.com/variant-product-table">Install App</Button>
                    </Box>
                </Box>
                </InlineStack>
            </Card>
            </Box>
            </InlineGrid>

        </Layout.Section>
      </Layout>
    </Page>
  );
}