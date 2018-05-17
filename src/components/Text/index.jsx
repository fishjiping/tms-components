import React from 'react';
import './index.less';

export default function Text (props) {
    const { fontSize, color, textAlign, content, marginBottom } = props;

    return (
        <div 
            className="text" 
            style={{
                marginBottom: marginBottom ? `${marginBottom / 100}rem`: 0,
                fontSize: `${fontSize / 100}rem`,
                color,
                textAlign
            }}
            
        >
            {
                content && content.split('\n').map((text) => {
                    return <p>{text}</p>;
                })
            }
        </div>
    );
}

