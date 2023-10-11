//Leaderboard component that displays 3 columns with top users of the day, month, and all time

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Users from '../services/users.service';
import Post from './Post';
import Cat from './CatProfile';
import { useMediaQuery } from 'react-responsive';
import Leaderboards from '../services/leaderboard.service'

export default function Leaderboard () {



    const isMobile = useMediaQuery({ query: `(max-width: 1100px)` });

    const isHidden = isMobile ? "hidden" : "";

    const isNotHidden = !isMobile ? "hidden" : "";

    const [selectValue, setSelectValue] = useState("day");

    async function fetchLeaderboard () {
        try {
            const leaderboard = await Leaderboards.getFullLeaderboard();
            console.log(leaderboard)
            return leaderboard;
        } catch (err) {
            console.error(err)
        }
    }


    const {
        status,
        error,
        data: leaderboard,
    } = useQuery({
        queryKey: ["leaderboard"],
        queryFn: fetchLeaderboard,
        refetchInterval: 7000,
    });

    if (status === "loading") {
        return <p>Loading...</p>;
      }
      
      if (status === "error") {
        return <p className="error">An error has occurred: {error.message}</p>;
      }

      const topDay = leaderboard.day.length > 0 ? leaderboard?.day?.map((cat, index) => (
        <li key={cat.id}> 
        <h3>#{leaderboard.day[cat] + 1}</h3>
        <h2>{cat.name}</h2>
        <p>Average Rating: {cat.averageRating.toFixed(1)}</p>
        </li>
        )) : <li><p>There are no top cats of the day.</p></li>;

        const topMonth = leaderboard.month.length > 0 ? leaderboard?.month?.map((cat, index) => (
            <li key={cat.id}> 
            <h3>#{index + 1}</h3>
            <h2>{cat.name}</h2>
            <p>Average Rating: {cat.averageRating.toFixed(1)}</p>
            </li>
            )) : <li><p>There are no top cats of the month.</p></li>;

        const topAllTime = leaderboard.all.length > 0 ? leaderboard?.all?.map((cat, index) => (
            <li key={cat.id}> 
            <h3>#{index + 1}</h3>
            <h2>{cat.name}</h2>
            <p>Average Rating: {cat.averageRating.toFixed(1)}</p>
            </li>
            )) : <li><p>There are no top cats of all time.</p></li>;


            const mobileList = selectValue === "day" ? topDay : selectValue === "month" ? topMonth : topAllTime

    return (

        <div className="container leaderboard-container">
            
            
            <div className={`top-day ${isHidden}`}>
                <ul>
                    <li><h1>Day</h1></li>
               {topDay}
                </ul>

            </div>
            <div className={`top-month ${isHidden}`}>
                <ul>
                    <li><h1>Month</h1></li>
                {topMonth}

                </ul>

            </div>
            <div className={`top-alltime ${isHidden}`}>
                <ul>
                    <li><h1>All Time</h1></li>
                {topAllTime}

                </ul>

            </div>
            {/* Mobile layout, one column */}
            <div className={`leaderboard-mobile ${isNotHidden}`}>
                <form className="leaderboard-form"> 
                <select name="leaderboard" id="leaderboard" onChange={(e) => setSelectValue(e.target.value)}>
                    <option value="day" >Day</option>
                    <option value="month" >Month</option>
                    <option value="all" >All Time</option>
                </select>
                </form>
                <ul>
                    {mobileList}

                   

                </ul>
            </div>
        </div>
    )

}

