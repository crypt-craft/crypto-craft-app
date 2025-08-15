import { useState } from 'react';

export function useForceUpdate() {
	const [_, setValue] = useState(0);
	//@ts-ignore
	return () => setValue((value) => value + 1);
}
