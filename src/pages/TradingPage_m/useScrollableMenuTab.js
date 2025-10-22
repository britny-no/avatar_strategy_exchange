// import { TweenMax } from 'gsap/gsap-core';
// import React from 'react';

// export default function useScrollableMenuTab({ className }) {
//     var touchStartX = 0;
//     var previousX = 0;

//     const DomRef = React.createRef();

//     const handleTouchStart = (e) => {
//         console.log(`cstared`);
//         touchStartX = e.targetTouches[0].clientX;
//     };

//     const handleTouchMove = (e) => {
//         const x = e.targetTouches[0].clientX;
//         const howMuchMoved = touchStartX - x;

//         var lastPossibleX = DomRef.current.getBoundingClientRect().width - window.screen.width;

//         var howMuchMove = howMuchMoved + previousX;

//         console.log(
//             `howMuchMove : `,
//             howMuchMove,
//             ' lastPossibleX : ',
//             lastPossibleX,
//             ' DomRef width :',
//             DomRef.current.getBoundingClientRect().width,
//         );
//         if (howMuchMove < 0 || howMuchMove >= lastPossibleX) return;

//         TweenMax.to(DomRef.current, 0, {
//             transform: `translate(${-howMuchMove}px,0)`,
//         });
//     };

//     const handleTouchEnd = (e) => {
//         console.log(`ended`);

//         previousX = -DomRef.current.computedStyleMap().get('transform')[0].x.value;
//     };

//     return { DomRef, handleTouchMove, handleTouchEnd, handleTouchStart };
// }
