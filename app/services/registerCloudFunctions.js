export async function registerCartTransform(admin) {
    try {
     // query to search the function 
      const response = await admin.graphql(`
        query {
          shopifyFunctions(first: 25) {
            nodes {
              app {
                title
              }
              apiType
              title
              id
            }
          }
        }
      `);
  
      const data = await response.json();
      console.log("Full Response Data:", JSON.stringify(data, null, 2));
  
      if (!data?.data?.shopifyFunctions?.nodes) {
        console.error("Invalid response structure:", data);
        return;
      }
  
      const functionNode = data.data.shopifyFunctions.nodes.find(
        (fn) => fn.title === "Offer Your Price Cloud Function" && fn.apiType === "cart_transform"
      );
  
      if (!functionNode) {
        console.error("Cart Transform function not found");
        return;
      }
  
      console.log("Found function ID:", functionNode.id);
  
      // Register the function
      const registerResponse = await admin.graphql(`
        mutation {
          cartTransformCreate(
            functionId: "${functionNode.id}"
            blockOnFailure: false
          ) {
            cartTransform {
              id
              functionId
            }
            userErrors {
              field
              message
            }
          }
        }
      `);
  
      const registerData = await registerResponse.json();
  
      if (registerData?.data?.cartTransformCreate?.cartTransform) {
        console.log("Registration successful!");
      } else {
        const userErrors = registerData?.data?.cartTransformCreate?.userErrors || [];
        userErrors.forEach((error) => {
          if (error.message === 'Could not enable cart transform because it is already registered') {
            console.log("Cart transform is already registered.");
          } else {
            console.error(`Registration failed. Error: ${error.message}`);
          }
        });
      }
    } catch (error) {
      console.error("Failed to register Cart Transform:", error);
    }
  }
  