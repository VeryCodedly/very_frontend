'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollKey = `scrollPos_${pathname}`;

    // Restore scroll on back/forward
    const restoreScroll = () => {
      const saved = sessionStorage.getItem(scrollKey);
      if (saved) {
        // Soft delay to wait for layout
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(saved, 10));
        });
      }
    };

    // Save scroll before unload/navigation
    const saveScroll = () => {
      sessionStorage.setItem(scrollKey, window.scrollY.toString());
    };

    window.addEventListener('beforeunload', saveScroll);
    window.addEventListener('popstate', () => {
      saveScroll();
      restoreScroll();
    });

    // Optional: restore on mount in case user refreshes
    restoreScroll();

    return () => {
      window.removeEventListener('beforeunload', saveScroll);
      window.removeEventListener('popstate', restoreScroll);
    };
  }, [pathname]);

  return null; // nothing rendered
}

// 'use client';

// import { useEffect } from 'react';

// export default function ScrollRestoration() {
//   useEffect(() => {
//     // Restore scroll position on mount (after refresh or navigation)
//     const savedScroll = sessionStorage.getItem(`scrollPos_${window.location.pathname}`);
//     if (savedScroll) {
//         window.scrollTo(0, parseInt(savedScroll, 10));
//     }

//     // Save scroll position before unload/refresh/navigation
//     const saveScrollPosition = () => {
//       sessionStorage.setItem(`scrollPos_${window.location.pathname}`, window.scrollY.toString());
//     };

//     // Save on beforeunload (refresh, close tab, etc.)
//     window.addEventListener('beforeunload', saveScrollPosition);

//     // save on Next.js route change (client-side navigation)
//     // handle this via popstate listener for simplicity
//     window.addEventListener('popstate', saveScrollPosition);

//     return () => {
//       window.removeEventListener('beforeunload', saveScrollPosition);
//       window.removeEventListener('popstate', saveScrollPosition);
//       // Final save on unmount
//       saveScrollPosition();
//     };
//   }, []);

//   // This component renders nothing
//   return null;
// }