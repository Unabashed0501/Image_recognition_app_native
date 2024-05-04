const BASEURL = "http://localhost:8080";

const queryEmbedding = async (
  values: any[],
  namespace: string
): Promise<any> => {
  const requestData = {
    values: values,
    namespace: namespace,
  };

  try {
    const response = await fetch(BASEURL + "/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    // Check if the response is successful (status code 200-299)
    if (response.ok) {
      // Parse the JSON response and return it
      const data = await response.json();
      return data;
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

const queryAllEmbeddings = async (): Promise<any[]> => {
  try {
    const response = await fetch(BASEURL + "/api/queryAllEmbeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // Parse the JSON response and return it
      const data = await response.json();
      console.log(data);
      return data;
    } else {
      throw new Error("Failed to query all embeddings");
    }
  } catch (error) {
    console.error("Error querying all embeddings:", error);
    throw error;
  }
};

const getProcessedImage = async (requestData: any): Promise<any> => {
  const { path } = requestData;
  try {
    const response = await fetch(BASEURL + "/api/getProcessedImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(path),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to get processed image");
    }
  } catch (error) {
    console.error("Error getting processed image:", error);
    throw error;
  }
};

const updateEmbedding = async (
  id: string,
  metadata: Record<string, any>
): Promise<void> => {
  const requestData = {
    id: id,
    metadata: metadata,
  };

  try {
    const response = await fetch(BASEURL + "/api/updateEmbedding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      console.log("Embedding updated successfully");
    } else {
      throw new Error("Failed to update embedding");
    }
  } catch (error) {
    console.error("Error updating embedding:", error);
    throw error;
  }
};

const saveEmbedding = async (requestData: any): Promise<any> => {
  // Destructure the data object to extract necessary fields
  // const { id, imageUrl, word, type } = requestData;

  try {
    const response = await fetch(BASEURL + "/api/saveEmbedding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
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
    const response = await fetch(BASEURL + "/api/deleteNamespace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ namespace }),
    });

    if (response.ok) {
      console.log("Deleted namespace successfully");
    } else {
      throw new Error("Failed to delete namespace");
    }
  } catch (error) {
    console.error("Error deleting namespace:", error);
    throw error;
  }
};

async function imageUrlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert the image to Base64."));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error("Failed to fetch the image: " + error);
  }
}

export {
  queryEmbedding,
  queryAllEmbeddings,
  getProcessedImage,
  updateEmbedding,
  saveEmbedding,
  deleteNamespace,
};
