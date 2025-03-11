import fetch from "node-fetch";
import { INFLUXDB_TOKEN, INFLUXDB_URL } from "../config/env.js";

// Tool: Write Data
export async function writeData({ org, bucket, data, precision }) {
  // Add extremely clear logging
  console.log(`=== WRITE-DATA TOOL CALLED ===`);
  console.log(
    `Writing to org: ${org}, bucket: ${bucket}, data length: ${data.length}`,
  );

  try {
    // Simplified approach focusing on core functionality
    let endpoint = `/api/v2/write?org=${encodeURIComponent(org)}&bucket=${encodeURIComponent(bucket)
      }`;
    if (precision) {
      endpoint += `&precision=${precision}`;
    }

    console.log(`Write URL: ${INFLUXDB_URL}${endpoint}`);

    // Use fetch directly instead of our wrapper to eliminate any potential issues
    const response = await fetch(`${INFLUXDB_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Authorization": `Token ${INFLUXDB_TOKEN}`,
      },
      body: data,
    });

    console.log(`Write response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to write data: ${response.status} ${errorText}`,
      );
    }

    console.log(`=== WRITE-DATA TOOL COMPLETED SUCCESSFULLY ===`);
    return {
      content: [{
        type: "text",
        text: "Data written successfully",
      }],
    };
  } catch (error) {
    console.error(`=== WRITE-DATA TOOL ERROR: ${error.message} ===`);
    return {
      content: [{
        type: "text",
        text: `Error writing data: ${error.message}`,
      }],
      isError: true,
    };
  }
}
