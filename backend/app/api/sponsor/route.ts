import { SponsorTxRequestBody } from "@/app/SponsorTx";
import { NextRequest, NextResponse } from "next/server";
import { enokiClient } from "@/app/EnokiClient";

/*
mainnet 배포할 때는 보안에 신경써야 함!
*/
export const POST = async (request: NextRequest) => {
  try {
    const { network, txBytes, sender, allowedAddresses }: SponsorTxRequestBody =
      await request.json();

    const response = await enokiClient.createSponsoredTransaction({
      network,
      transactionKindBytes: txBytes,
      sender,
      allowedAddresses,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    // 'error'를 'Error' 타입으로 캐스팅
    if (error instanceof Error) {
      console.error("Error creating sponsored transaction:", error.message);
      return NextResponse.json(
        { error: `Could not create sponsored transaction block: ${error.message}` },
        { status: 500 }
      );
    }

    // 'unknown' 타입인 경우, 기본적인 에러 메시지 반환
    console.error("Unknown error:", error);
    return NextResponse.json(
      { error: "Could not create sponsored transaction block: Unknown error." },
      { status: 500 }
    );
  }
};