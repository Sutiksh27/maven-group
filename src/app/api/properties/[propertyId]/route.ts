import dynamodb from "@/app/lib/dynamodb";
import { NextResponse } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
});

export async function GET(
  _req: Request,
  { params }: { params: { propertyId: string } }
) {
  try {
    if (!params.propertyId) {
      return NextResponse.json({ error: "Property ID is required" });
    }

    // Retrieve property details from DynamoDB based on ID
    const parameter = {
      TableName: "properties",
      Key: {
        id: params.propertyId.toString(),
      },
    };

    const data = await dynamodb.get(parameter).promise();

    // Check if property exists
    if (!data.Item) {
      return NextResponse.json({ error: "Property not found" });
    }

    // Extract property details from the response data
    const property = data.Item;

    const fullImageUrl = property.imageUrl;
    const imageFolder = new URL(fullImageUrl).pathname.substring(1);

    const imageKeys = await listObjectsInFolder(imageFolder);
    

    if (imageKeys.length === 0) {
      console.warn("No images found in folder:", imageFolder);
    } else {
    }

      const imageUrls = imageKeys.map((key) => {

      return encodeURI("https://d2cw6pmn7dqyjd.cloudfront.net/"+key)
    });

    property.imageUrls = imageUrls;

    // Return the property details
    return NextResponse.json(property);
  } catch (error) {
    console.error("Error retrieving property:", error);
    NextResponse.json({ error: "Failed to retrieve property" });
  }
}

async function listObjectsInFolder(folder: string): Promise<string[]> {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Prefix: folder,
  };

  const response = await s3.listObjectsV2(params).promise();

  // Filter out directory-like entries
  return response.Contents
    ? response.Contents.map((item) => item.Key!).filter((key) => !key.endsWith('/'))
    : [];
}
