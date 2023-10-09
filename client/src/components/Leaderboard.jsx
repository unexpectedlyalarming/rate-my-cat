//Leaderboard component that displays 3 columns with top users of the day, month, and all time

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Users from '../services/users.service';
import Post from './Post';
import Cat from './CatProfile';
import { useMediaQuery } from 'react-responsive';


export default function Leaderboard () {



    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

    const isHidden = isMobile ? "hidden" : "";

    const isNotHidden = !isMobile ? "hidden" : "";
    return (
        <div className="container leaderboard-container">
            <div className={`top-day ${isHidden}`}>
                <ul>
                You&apos;re
                </ul>

            </div>
            <div className={`top-month ${isHidden}`}>
                <ul>
on
                </ul>

            </div>
            <div className={`top-alltime ${isHidden}`}>
                <ul>
                    Desktop
                </ul>

            </div>
            {/* Mobile layout, one column */}
            <div className={`leaderboard-mobile ${isNotHidden}`}>
                <ul>
                   You&apos;re on mobile

                </ul>
            </div>
        </div>
    )

}

