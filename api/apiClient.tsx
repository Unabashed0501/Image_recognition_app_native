const queryEmbedding = async (
  values: any[],
  namespace: string
): Promise<any> => {
  const requestData = {
    values: values,
    namespace: namespace,
  };

  try {
    const response = await fetch("/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    // Check if the response is successful (status code 200-299)
    if (response.ok) {
      // Parse the JSON response and return it
      return await response.json();
    } else {
      // Handle non-successful responses
      throw new Error("Failed to query embedding");
    }
  } catch (error) {
    // Handle errors that occur during the request
    console.error("Error querying embedding:", error);
    throw error; // Propagate the error to the caller
  }
};

const saveEmbedding = async (data: any): Promise<any> => {
  // Destructure the data object to extract necessary fields
  const { id, values, imageUrl, type } = data;

  // Construct the request body including metadata
  const requestBody = {
    id,
    values,
    metadata: {
      id,
      imageUrl,
      type,
      /* other metadata fields */
    },
  };
  try {
    const response = await fetch("/api/saveEmbedding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to save embedding");
    }
  } catch (error) {
    console.error("Error saving embedding:", error);
    throw error;
  }
};

const deleteNamespace = async (namespace: string): Promise<void> => {
  try {
    const response = await fetch("/api/deleteNamespace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ namespace }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete namespace");
    }
  } catch (error) {
    console.error("Error deleting namespace:", error);
    throw error;
  }
};

export default { queryEmbedding, saveEmbedding, deleteNamespace };
