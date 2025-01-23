// The MOVE contract for storing hiking records on Sui blockchain
module shallwemove::shallwemove;

use std::string::{ String, utf8 };
use sui::display;
use sui::package;

// 하이킹 기록을 저장하는 구조체
public struct ShallWeMove has key, store {
    id: UID,
    location: String,      // 산 이름 또는 등산로
    description: String,
    imageUrl: String,
    participants: u16,     // 참가자 수 (최대 65,535명)
    maxElevation: u16,     // 최대 고도 (미터, 최대 65,535m)
    duration: u16,         // 소요 시간 (분, 최대 약 45일)
    date: String,          // "YYYY-MM-DD" 형식
    startTime: String,     // "HH:mm" 형식
    endTime: String        // "HH:mm" 형식
}

// 모듈 초기화를 위한 One-Time Witness 타입
public struct SHALLWEMOVE has drop {}

// 모듈 초기화 함수 - 패키지가 처음 배포될 때 한 번만 실행됨
fun init(otx: SHALLWEMOVE, ctx: &mut TxContext) {
    let publisher = package::claim(otx, ctx);
    let mut display = display::new<ShallWeMove>(&publisher, ctx);

    display::add(&mut display, 
        utf8(b"name"), 
        utf8(b"ShallWeMove - {location}")
    );
    display::add(&mut display, 
        utf8(b"image_url"), 
        utf8(b"{imageUrl}")
    );
    display::add(&mut display, 
        utf8(b"description"), 
        utf8(b"{description}")
    );
    display::add(&mut display, 
        utf8(b"hiking_info"), 
        utf8(b"Max Elevation(m): {maxElevation}, Duration(mins): {duration}")
    );
    
    display::update_version(&mut display);

    transfer::public_transfer(publisher, tx_context::sender(ctx));
    transfer::public_transfer(display, tx_context::sender(ctx));
}

// 하이킹 기록 생성 함수
entry fun mint(
    location: String,
    description: String,
    imageUrl: String,
    participants: u16,
    maxElevation: u16,
    duration: u16,
    date: String,
    startTime: String,
    endTime: String,
    ctx: &mut TxContext
) {
    let shallwemove = new(
        location,
        description,
        imageUrl,
        participants,
        maxElevation,
        duration,
        date,
        startTime,
        endTime,
        ctx
    );

    transfer::transfer(shallwemove, tx_context::sender(ctx));
}

fun new(
    location: String, 
    description: String, 
    imageUrl: String, 
    participants: u16,
    maxElevation: u16, 
    duration: u16,
    date: String,
    startTime: String,
    endTime: String,
    ctx: &mut TxContext
): ShallWeMove {
    let id = object::new(ctx);
    let location = location;
    let description = description;
    let imageUrl = imageUrl;
    let participants = participants;
    let maxElevation = maxElevation;
    let duration = duration;
    let date = date;
    let startTime = startTime;
    let endTime = endTime;
    ShallWeMove {
        id,
        location,
        description,
        imageUrl,
        participants,
        maxElevation,
        duration,
        date,
        startTime,
        endTime,
    }
}