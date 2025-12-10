# KRDS (Korea Design System)

독립적인 디자인 시스템으로 다른 프로젝트에서도 사용할 수 있습니다.

## 📁 구조

```
design-system/
├── krds.css          # 메인 디자인 시스템 CSS
├── README.md         # 사용 가이드
└── examples/         # 사용 예제 (선택사항)
```

## 🚀 사용법

### 1. 기본 사용

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="design-system/krds.css">
</head>
<body>
    <!-- KRDS 컴포넌트 사용 -->
    <button class="btn btn-primary">버튼</button>
    <input class="input" placeholder="입력하세요">
</body>
</html>
```

### 2. CDN 사용 (권장)

```html
<link rel="stylesheet" href="https://your-domain.com/design-system/krds.css">
```

## 🎨 컴포넌트

### 버튼 (Button)
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-sm">Small</button>
<button class="btn btn-lg">Large</button>
```

### 입력 필드 (Input)
```html
<input class="input" placeholder="텍스트 입력">
<textarea class="textarea" placeholder="여러 줄 입력"></textarea>
<select class="select">
    <option>옵션 1</option>
    <option>옵션 2</option>
</select>
```

### 카드 (Card)
```html
<div class="card">
    <div class="card-header">
        <h3>카드 제목</h3>
    </div>
    <div class="card-body">
        <p>카드 내용</p>
    </div>
    <div class="card-footer">
        <button class="btn btn-primary">확인</button>
    </div>
</div>
```

### 테이블 (Table)
```html
<div class="table-container">
    <table class="table">
        <thead>
            <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>상태</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>홍길동</td>
                <td>hong@example.com</td>
                <td><span class="badge badge-success">활성</span></td>
            </tr>
        </tbody>
    </table>
</div>
```

### 모달 (Modal)
```html
<div class="modal-overlay">
    <div class="modal-dialog">
        <div class="modal-header">
            <h3 class="modal-title">모달 제목</h3>
            <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
            <p>모달 내용</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline">취소</button>
            <button class="btn btn-primary">확인</button>
        </div>
    </div>
</div>
```

## 🎯 유틸리티 클래스

### Flexbox
```html
<div class="flex items-center justify-between">
    <span>왼쪽</span>
    <span>오른쪽</span>
</div>
```

### 간격 (Spacing)
```html
<div class="p-4 mb-6">패딩과 마진</div>
```

### 텍스트
```html
<h1 class="text-2xl font-bold text-primary">제목</h1>
<p class="text-sm text-secondary">부제목</p>
```

## 🌙 다크 모드

```css
/* 다크 모드 적용 */
[data-theme="dark"] {
  --bg-primary: var(--color-gray-900);
  --bg-secondary: var(--color-gray-800);
  --text-primary: var(--color-white);
  /* ... 기타 색상 변수 */
}
```

## 📱 반응형

모든 컴포넌트는 반응형으로 설계되었습니다.

- **Mobile**: 320px ~ 767px
- **Tablet**: 768px ~ 1023px  
- **Desktop**: 1024px+

## ♿ 접근성

- 키보드 네비게이션 지원
- 스크린 리더 지원
- 고대비 모드 지원
- 모션 감소 설정 지원

## 🔧 커스터마이징

CSS 변수를 사용하여 쉽게 커스터마이징할 수 있습니다:

```css
:root {
  --color-primary-600: #your-color;
  --font-size-base: 16px;
  --spacing-4: 20px;
}
```

## 📄 라이선스

이 디자인 시스템은 자유롭게 사용할 수 있습니다.

