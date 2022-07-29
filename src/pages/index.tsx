import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

/**
 *? 서버에서 랜더링할 필요가 없어서 동적 임포트로 컴포넌트를 가져온다.
 ** window.location.origin을 서버에서 사용 불가능하기 때문에
 */
const CreateLinkForm = dynamic(() => import('../components/createLinkForm'), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div
      className="h-screen grid place-items-center
      bg-gradient-to-br from-violet-900 to-indigo-900"
    >
      <Suspense>
        <CreateLinkForm />
      </Suspense>
    </div>
  );
};

export default Home;
