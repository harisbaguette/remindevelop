# 리마인드 보관소 (Remind Vault) 개발 로드맵

이 문서는 서비스의 정식 런칭과 앱 스토어 심사 통과, 그리고 고품질의 사용자 경험을 제공하기 위해 필요한 작업들을 정리한 로드맵입니다.

## 🚨 Phase 1: 필수 기능 & 심사 통과 (Critical)
**앱 스토어 등록 및 기본적인 서비스 운영을 위해 반드시 필요한 기능입니다.**

- [ ] **계정 탈퇴 기능 구현** (Priority: Highest)
    - [ ] `Settings` 페이지에 '회원 탈퇴' 버튼 활성화
    - [ ] Supabase Auth User 및 관련 데이터(Links) 삭제 로직 구현 (API Route)
    - [ ] 탈퇴 시 확인 모달(Confirm Modal) 제공
- [ ] **Middleware 라우트 보호** (Priority: High)
    - [ ] `middleware.ts` 도입하여 비로그인 유저의 접근 원천 차단
    - [ ] 로그인 된 유저의 `/login` 페이지 접근 시 메인으로 리다이렉트
- [ ] **개인정보 처리방침 및 이용약관**
    - [ ] 앱 내 메뉴에 '이용약관' 페이지 연결 (Webview 또는 텍스트 페이지)

## 🛠 Phase 2: 서비스 품질 향상 (Production Quality)
**"토스" 같은 매끄러운 경험을 주기 위한 기술적 고도화 작업입니다.**

- [ ] **URL 메타데이터 스크래핑 (Open Graph)**
    - [ ] 링크 추가 시 Server-side에서 `og:title`, `og:image`, `og:description` 수집
    - [ ] AI 요약 실패 시 메타데이터를 대체재로 사용 (환각 방지)
    - [ ] 카드 UI에 썸네일 이미지 표시
- [ ] **보안 및 에러 처리**
    - [x] Global Error Boundary 설정 (흰 화면 방지)
    - [ ] API Rate Limiting (도배 방지)
- [ ] **링크 수정 기능**
    - [x] 분류/제목이 잘못된 경우 유저가 직접 수정할 수 있는 UI 제공

## 💎 Phase 3: UX 디테일 (UX Polish)
**사용자가 "앱이 좋다"고 느끼게 만드는 디테일입니다.**

- [x] **인터랙티브 피드백 (Toast)**
    - [x] `alert()` 대신 `sonner` 라이브러리 등을 사용하여 세련된 토스트 메시지 구현
- [ ] **Empty States & Skeleton**
    - [ ] 데이터 로딩 시 스켈레톤 UI 적용 (LinkList에 적용됨)
    - [x] 보관함이 비었을 때 귀여운 일러스트 표출
- [x] **다크 모드 지원**
    - [x] `next-themes` 적용하여 다크 모드 완벽 대응

## 📱 Phase 4: 모바일 네이티브 (Mobile Native)
**앱으로서의 가치를 완성하는 단계입니다.**

- [x] **공유하기 (Share Intent) 연동**
    - [x] 다른 앱(브라우저, 유튜브 등)에서 '공유하기'로 리마인드 보관소에 바로 저장 (PWA & Android Native)
- [ ] **딥링크 (Deep Links)**
    - [ ] 이메일 인증 등 외부 링크 클릭 시 앱으로 바로 진입
- [ ] **푸시 알림 (Push Notifications)**
    - [ ] 리마인드 알림 발송 (FCM Integration)

---
**진행 상황 업데이트**
- 2024-12-10: 로드맵 작성 완료. Phase 1부터 개발 착수.
