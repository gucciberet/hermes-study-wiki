import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

export default function Home(): ReactNode {
  return (
    <Layout title="Hermes를 쉽게 시작하고 운영하기" description="Hermes 학습과 운영을 위한 한국어 안내">
      <main className="hero-page">
        <section className="hero-section">
          <p className="eyebrow">HERMES KOREAN GUIDE</p>
          <h1>Hermes를<br />쉽게 시작하고 운영하기</h1>
          <p className="hero-copy">공식 문서의 핵심을 한국어로 정리했습니다. 입문부터 gateway·cron·보안 운영까지 필요한 내용을 차례로 익혀 보세요.</p>
          <Link className="button button--primary button--lg" to="/docs/quick-start">빠른 시작 보기</Link>
        </section>
        <section className="guide-grid">
          <Link to="/docs/getting-started/installation"><strong>01. 설치</strong><span>내 컴퓨터에서 Hermes 시작하기</span></Link>
          <Link to="/docs/tools"><strong>02. 도구와 권한</strong><span>Hermes가 실제 일을 하는 방법</span></Link>
          <Link to="/docs/operations-overview"><strong>03. 운영 시작</strong><span>실서비스 전 점검할 기본 원칙</span></Link>
          <Link to="/docs/gateway"><strong>04. Gateway</strong><span>Slack 등 메시지 봇을 안정적으로 운영하기</span></Link>
          <Link to="/docs/scheduled-tasks"><strong>05. 예약 작업</strong><span>cron으로 반복 업무 자동화하기</span></Link>
          <Link to="/docs/security"><strong>06. 보안 기준</strong><span>권한·비밀값·MCP를 안전하게 관리하기</span></Link>
        </section>
      </main>
    </Layout>
  );
}
