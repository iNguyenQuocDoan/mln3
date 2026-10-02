# Game Assets — Đường Đua Đại Đoàn Kết

## Cấu trúc

game-assets/
├── cards/
│   └── card-back.png
└── teams/
    ├── team-1/
    │   ├── idle.png
    │   └── move.png
    ├── team-2/
    │   ├── idle.png
    │   └── move.png
    ├── team-3/
    │   ├── idle.png
    │   └── move.png
    ├── team-4/
    │   ├── idle.png
    │   └── move.png
    └── team-5/
        ├── idle.png
        └── move.png

## Cách dùng

1. Thả 10 ảnh nhân vật nền trong suốt vào đúng folder.
2. Giữ đúng tên `idle.png` và `move.png`.
3. Copy toàn bộ nội dung `game-assets/` vào:
   `public/assets/game/`
4. Khi đó path trong code sẽ là:
   `/assets/game/cards/card-back.png`
   `/assets/game/teams/team-1/idle.png`
   `/assets/game/teams/team-1/move.png`
   ...

Ảnh `card-back.png` đã được đóng gói từ ảnh bạn cung cấp.
