import React, { useState, useEffect } from 'react';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { convertToString } from './calendarDateFormat';

var week = new Date();
week.setDate(week.getDate() + 7);

export default function Options({ date, availablePages, currentPage, handlePage, handleDateChange }) {
    const [fromCalOpened, setFromCalOpened] = useState(false);
    const [toCalOpened, setToCalOpened] = useState(false);
    const [toCalDate, setToCalDate] = useState();
    const [fromCalDate, setFromCalDate] = useState();

    useEffect(() => {
        if (!date.fromDate) return;

        let year = date.toDate.slice(0, 4);
        let month = `${parseInt(date.toDate.slice(4, 6)) - 1}`;
        month = month < 10 ? `0${month}` : month;
        let day = date.toDate.slice(6, 8);
        setToCalDate(new Date(year, month, day));
        year = date.fromDate.slice(0, 4);
        month = `${parseInt(date.fromDate.slice(4, 6)) - 1}`;
        month = month < 10 ? `0${month}` : month;
        day = date.fromDate.slice(6, 8);
        setFromCalDate(new Date(year, month, day));
    }, [date]);

    const openFromCal = () => {
        setFromCalOpened(true);
        setToCalOpened(false);
    };

    const openToCal = () => {
        setToCalOpened(true);
        setFromCalOpened(false);
    };

    const handleDateClick = (target) => (value) => {
        if (target === 'fromCal') {
            setFromCalOpened(false);
            setFromCalDate(value);
        }
        if (target === 'toCal') {
            setToCalOpened(false);
            setToCalDate(value);
        }
    };

    const handleSearch = () => {
        let date = {
            fromDate: convertToString(fromCalDate),
            toDate: convertToString(toCalDate),
        };
        handleDateChange(date);
    };

    return (
        <TradingHistoryOption>
            <FromDateWrapper style={{ position: 'relative' }} onClick={openFromCal}>
                {fromCalDate ? (fromCalDate instanceof Date ? convertToString(fromCalDate) : fromCalDate) : '시작일'}
                {fromCalOpened && (
                    <CalendarWrapper>
                        <Calendar maxDate={new Date()} onChange={handleDateClick('fromCal')} value={fromCalDate} />
                    </CalendarWrapper>
                )}
            </FromDateWrapper>
            <ToDateWrapper onClick={openToCal}>
                {toCalDate ? (toCalDate instanceof Date ? convertToString(toCalDate) : toCalDate) : '마지막일'}
                {toCalOpened && (
                    <CalendarWrapper>
                        <Calendar
                            maxDate={new Date()}
                            onChange={handleDateClick('toCal')}
                            minDate={fromCalDate}
                            value={toCalDate}
                        />
                    </CalendarWrapper>
                )}
            </ToDateWrapper>
            <div>{`${currentPage} page 1-${availablePages}`}</div>
            <div>
                <KeyboardArrowLeftIcon style={{ cursor: 'pointer' }} fontSize="large" onClick={handlePage(-1)} />
                <KeyboardArrowRightIcon style={{ cursor: 'pointer' }} fontSize="large" onClick={handlePage(1)} />
            </div>
            <div onClick={handleSearch}>검색</div>
        </TradingHistoryOption>
    );
}

const TradingHistoryOption = styled.div`
    z-index: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    color: #818181;
    height: 40px;
    position: sticky;
    left: 0;
    top: 0;
    background: #f2f2f2;
`;

const CalendarWrapper = styled.div`
    background: grey;
    position: absolute;
    right: 0;
`;

const FromDateWrapper = styled.div`
    margin-left: 10px;
`;
const ToDateWrapper = styled.div`
    margin-left: 15px;
    margin-right: 15px;
`;
