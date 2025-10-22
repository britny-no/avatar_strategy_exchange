import React from 'react';

export const updateTrId = () => {
    const pre_tid = Number(sessionStorage.getItem('trid'))
    const new_tid = String(pre_tid + 1)

    sessionStorage.setItem('trid', new_tid)
    return new_tid
}

export const dotTwo = (num: number) => Math.floor(num * 100) / 100

export const dotFour = (num: number) => Math.floor(num * 10000) / 10000

