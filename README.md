🐣 AI Dashboard Frontend (React + TypeScript)

## 🐣 프로젝트 개요
본 프로젝트는 **AI 기반 추천 시스템**을 사용자에게 직관적으로 제공하기 위한 대시보드입니다.  
추천 데이터는 외부 API(OpenFoodFacts, CocktailDB 등)와 연동하여 가져오며,  
이를 **카드 UI**와 **네트워크 그래프(D3.js)**로 시각화합니다.

---

## 🐣 주요 기능
- 카테고리 선택
  - Recoil 상태 관리로 카테고리 선택 및 데이터 반영
- **데이터 연동**  
  - OpenFoodFacts, CocktailDB API 호출 및 전처리
- **데이터 전처리**  
  - 긴 텍스트 축약(`shortenName`), NaN 필터링
- **시각화**  
  - BarChart, PieChart, LineChart를 통한 데이터 시각화
- **UX 개선**  
  - 로딩 상태 표시, 결과 없음 처리, 카드형 레이아웃 및 hover 인터랙션
- **렌더링 최적화**  
  - `overflowX` 처리, 데이터 필터링으로 안정적인 렌더링
- **추천 카드 UI**  
  - API 데이터를 받아 `RecommendationItem` 타입으로 매핑  
  - 평점/가격/지역 정보를 카드 형태로 표시  
  - 조건부 렌더링(`불러오는 중`, `추천 결과 없음`) 처리
- **관계 네트워크 그래프 (D3.js)**  
  - 카테고리 중심 노드와 추천 아이템 노드를 force-directed graph로 시각화  
  - 노드 드래그 및 레이블 표시 기능 포함
- **상태 관리**  
  - `recoil`을 통한 카테고리 상태 관리  
  - `tanstack-query`를 통한 API 데이터 fetch 및 캐싱

---

## 🐣 기술 스택
- **Frontend**: React, TypeScript  
- **State Management**: Recoil, Tanstack Query  
- **Data Visualization**: D3.js  
- **API Integration**: OpenFoodFacts, CocktailDB  
- **Styling**: Inline CSS + Flex/Grid Layout  

---

## 🐣 진행 상황
- ✅ Typescript 기반 React  
- ✅ Recoil, Tanstack Query 사용  
- ✅ 백엔드 API 연동 및 데이터 처리 로직 구현 *(진행 중)*  
- ✅ Rendering 최적화 및 조건부 렌더링  
- ✅ D3.js 기반 데이터 시각화 구현 *(진행 중)*  
- ✅ 문제 해결 (API 구조 불일치 → UI 매핑 해결)  

---

## 🐣 향후 개선 방향
- 추천 카드 클릭 시 그래프 노드 하이라이트 연동  
- Jest 기반 단위 테스트 추가  
- 디자인 시스템(Figma 기반) 적용  
- GitLab CI/CD 파이프라인 구축  

---

👉 이렇게 정리하면 README로 바로 활용할 수 있고, 프로젝트의 **목적·진행 상황·향후 계획**까지 한눈에 들어옵니다.  
원하면 제가 이 README를 **포트폴리오용으로 조금 더 기업 친화적인 톤**으로 다듬어드릴 수도 있어요.
