import { useRef } from 'react';

export const useTabBarVisibility = (onHide, onShow) => {
  const lastOffset = useRef(0);
  const scrollDirection = useRef(null);
  const isHidden = useRef(false);

  return (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - lastOffset.current;

    // ignorar topo
    if (currentOffset <= 0) {
      lastOffset.current = currentOffset;
      return;
    }

    // detectar direção real
    if (Math.abs(diff) < 8) return; // ✅ elimina ruído (ESSENCIAL)

    if (diff > 0) {
      // SCROLL PARA BAIXO
      if (!isHidden.current) {
        onHide();
        isHidden.current = true;
      }
      scrollDirection.current = 'down';
    } else {
      // SCROLL PARA CIMA
      if (isHidden.current) {
        onShow();
        isHidden.current = false;
      }
      scrollDirection.current = 'up';
    }

    lastOffset.current = currentOffset;
  };
};
