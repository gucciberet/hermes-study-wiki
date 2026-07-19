import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

export default function Home(): ReactNode {
  return (
    <Layout title="Hermes를 쉽게 시작하기" description="Hermes 학습을 위한 쉬운 한국어 안내">
      <main className="hero-page">
        <section className="hero-section">
          <p className="eyebrow">HERMES EASY GUIDE</p>
          <h1>Hermes를<br />쉽게 이해하기</h1>
          <p className="hero-copy">공식 문서의 핵심을 한국어로 간단하게 정리한 시작 안내서입니다.</p>
          <Link className="button button--primary button--lg" to="/docs/intro">첫 페이지부터 보기</Link>
        </section>
        <section className="guide-grid">
          <Link to="/docs/install"><strong>01. 설치</strong><span>내 컴퓨터에서 Hermes 시작하기</span></Link>
          <Link to="/docs/quick-start"><strong>02. 빠른 시작</strong><span>첫 대화와 기본 명령</span></Link>
          <Link to="/docs/tools"><strong>03. 도구</strong><span>Hermes가 실제 일을 하는 방법</span></Link>
          <Link to="/docs/skills-memory"><strong>04. 스킬과 메모리</strong><span>점점 나에게 맞춰지는 구조</span></Link>
        </section>
      </main>
    </Layout>
  );
}
