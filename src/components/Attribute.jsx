import React from 'react';
import {  ATTRIBUTE_LIST } from '../consts.js';

function Attributes({ user, handleAttributeUpdate, getModifier}) {
    return (
        <>
        {ATTRIBUTE_LIST.map((attribute, index) => (
        <div>
          <div key={index}>{attribute}</div>
          <div>
            Value: 
            {user.attributes[attribute]}

            | Modifier 
            {getModifier(user.attributes[attribute])}
            <button onClick={() => handleAttributeUpdate(user.user_id, attribute, "attribute_increment")}>+</button>
            <button onClick={() => handleAttributeUpdate(user.user_id, attribute, "attribute_decrement")}>-</button>
          </div>
        </div>
      ))}
        </>
    );
    
}

export default Attributes;