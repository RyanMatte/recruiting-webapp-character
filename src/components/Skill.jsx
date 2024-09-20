import React from 'react';
import {  SKILL_LIST } from '../consts.js';

const Skills = ({ user, handleSkillUpdate, getModifier}) => {
    return (
        <div>
            <h1>{user.skill_points} remaining points</h1>
            <div>
              {SKILL_LIST.map((skill, index) => (
                <div>
                  <div key={index}>{skill.name} Modifier {skill.attributeModifier} {getModifier(user.attributes[skill.attributeModifier])}</div>
                  <div>
                    Value:
                    {user.skills[skill.name]}
                    <button onClick={() => handleSkillUpdate(user.user_id, skill.name, "skill_increment")}>+</button>
                    <button onClick={() => handleSkillUpdate(user.user_id, skill.name, "skill_decrement")}>-</button>
                    Total: 
                    {getModifier(user.attributes[skill.attributeModifier]) + user.skills[skill.name]}
                  </div>
                </div>
              ))}
            </div>
        </div>
    );
}

export default Skills;