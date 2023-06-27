'use client';

import {Button, Header} from 'ui';
import {foo} from '../../common/foo';

export default function Page() {
  const handleClick = async () => {
    console.log('renderer: ' + foo());
  };

  return (
    <>
      <Header text="Web" />
      <Button />
      <button onClick={handleClick}>Foo</button>
    </>
  );
}
