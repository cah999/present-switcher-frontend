import React from 'react';
import './Header.css'; // Стили для заголовка
import {ReactComponent as RectangleSvg} from '../assets/header.svg';


const Header = ({budget}) => {
    return (
        <svg className="header" width="150%" height="150%">
            <RectangleSvg width="100%" height="100%"/>
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
                Бюджет: {budget} рублей
            </text>
        </svg>
    );
};

export default Header;
