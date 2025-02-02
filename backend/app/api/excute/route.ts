import { NextRequest, NextResponse } from "next/server";
import { enokiClient } from "@/app/EnokiClient";

export const POST = async (request: NextRequest) => {
  try {
    // 클라이언트에서 받은 digest, signature
    const { digest, signature } = await request.json();
    // 클라이언트에서 받은 정보를 이용하여 트랜잭션 실행
    const result = await enokiClient.executeSponsoredTransaction({
       digest, 
       signature,
    });

    return NextResponse.json({ digest: result.digest }, { status: 200 });
  } catch (error: unknown) {
    // 'error'를 'Error' 타입으로 캐스팅
    if (error instanceof Error) {
      console.error("Error executing sponsored transaction:", error.message);
      return NextResponse.json(
        { error: `Transaction execution failed: ${error.message}` },
        { status: 500 }
      );
    }

    // 'unknown' 타입인 경우, 기본적인 에러 메시지 반환
    console.error("Unknown error:", error);
    return NextResponse.json(
      { error: "Transaction execution failed: Unknown error." },
      { status: 500 }
    );
  }
};