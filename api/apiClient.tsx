const BASEURL = "http://10.10.2.59:8080";

const getEmbedding = async (imageBase64: string): Promise<any> => {
  const data = { imageBase64: imageBase64 };
  try {
    const response = await fetch(BASEURL + "/api/getEmbedding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // Parse the JSON response and return it
      const resdata = await response.json();
      // console.log("gggggg", resdata);
      return resdata as string;
    } else {
      throw new Error("Failed to get embeddings");
    }
  } catch (error) {
    console.error("Error getting embeddings:", error);
    throw error;
  }
};

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
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      console.log("ok");
      // wrong
      const data = await response.json();

      console.log("data: ", data);
      const resData = data ? data["str"] : null;
      return resData;
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

const dataURLtoFile = (dataurl: any, filename: any) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n) {
    u8arr[n - 1] = bstr.charCodeAt(n - 1);
    n -= 1; // to make eslint happy
  }
  return new File([u8arr], filename, { type: mime });
};

const saveEmbedding = async (
  imageBase64: string,
  metadata: Record<string, any>
): Promise<void> => {
  const requestData = {
    imageBase64: imageBase64,
    metadata: metadata,
  };
  // const { id, imageUrl, word, type } = requestData;

  try {
    console.log("in save api");
    // const file = dataURLtoFile(
    //   imageBase64,
    //   "image.jpg"
    //   // "data:image/png;base64,iVBORw0KGgoAAAANSUhEU..."
    // );
    // put file into form data
    // const data = new FormData();

    // data.append("name", "oscar");
    // data.append("image", imageBase64);
    // data.append("metadata", JSON.stringify(metadata));
    // console.log(data.getAll("metadata"));
    const response = await fetch(BASEURL + "/api/saveEmbedding", {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);

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
  getEmbedding,
  queryEmbedding,
  queryAllEmbeddings,
  getProcessedImage,
  updateEmbedding,
  saveEmbedding,
  deleteNamespace,
};
