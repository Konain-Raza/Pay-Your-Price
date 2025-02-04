import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import { createMetafields } from "./services/registerMetafields";
import { registerCartTransform } from "./services/registerCloudFunctions";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October24,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  hooks: {
    afterAuth: async ({ session }) => {
      console.log("AfterAuth hook triggered");
      await shopify.registerWebhooks({ session });
  
      try {
        const { admin } = await authenticate.admin(session);
  
        if (!admin) {
          console.error("Admin not found or authentication failed");
          return;
        }
  
        console.log("Admin authenticated successfully");
  
        try {
          await createMetafields(admin);
          console.log("Metafields creation triggered successfully");
        } catch (metafieldsError) {
          console.error("Error creating metafields:", metafieldsError);
        }
  
        try {
          await registerCartTransform(admin);
          console.log("Cart transform registered successfully");
        } catch (cartTransformError) {
          console.error("Error registering cart transform:", cartTransformError);
        }
  
      } catch (error) {
        console.error("Error in afterAuth hook:", error);
      }
    },
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.October24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
