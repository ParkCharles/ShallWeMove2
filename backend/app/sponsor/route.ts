import { NextRequest, NextResponse } from "next/server";
import { SponsorTxRequestBody } from "@/app/SponsorTx";
import { enokiClient } from "@/app/EnokiClient";

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Processing sponsor transaction request...');
    
    // Check if enokiClient is properly initialized
    if (!enokiClient) {
      throw new Error('EnokiClient is not initialized');
    }

    // Validate request body
    const body = await request.json();
    const { network, txBytes, sender, allowedAddresses }: SponsorTxRequestBody = body;

    // Log request details (safely)
    console.log('📝 Request details:', {
      network,
      sender,
      allowedAddresses,
      txBytesLength: txBytes?.length,
      hasRequiredFields: {
        network: !!network,
        txBytes: !!txBytes,
        sender: !!sender
      }
    });

    // Validate required fields
    if (!txBytes) {
      throw new Error('Transaction bytes are missing');
    }
    if (!sender) {
      throw new Error('Sender address is missing');
    }
    if (!network) {
      throw new Error('Network is not specified');
    }

    console.log('🚀 Creating sponsored transaction...');
    
    const response = await enokiClient.createSponsoredTransaction({
      network,
      transactionKindBytes: txBytes,
      sender,
      allowedAddresses,
    });

    if (!response) {
      throw new Error('Received empty response from Enoki');
    }

    console.log('✅ Sponsored transaction created:', {
      hasBytes: !!response.bytes,
      hasDigest: !!response.digest,
    });
    
    return NextResponse.json(response);

  } catch (error: unknown) {
    console.error('❌ Sponsor transaction error:', error);
    
    let errorMessage = 'Unknown error occurred';
    let errorDetails = undefined;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      };
      console.error('Error details:', errorDetails);
    }

    return NextResponse.json(
      {
        error: `Failed to create sponsored transaction: ${errorMessage}`,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}